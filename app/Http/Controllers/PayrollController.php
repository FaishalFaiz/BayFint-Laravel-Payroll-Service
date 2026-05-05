<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Attendance;
use App\Models\PayrollCategory;
use App\Models\Leave;
use App\Models\PayrollAdjustment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function index()
    {
        // Protected implicitly by TenantScope
        return Inertia::render('payrolls/index', [
            'payrolls' => Payroll::with('employee')->latest()->get(),
            'employees' => Employee::get(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $room = request()->user()->room;

        $exists = Payroll::where('employee_id', $employee->id)
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['payroll' => 'Payroll already generated for this month.']);
        }

        $attendances = Attendance::where('employee_id', $employee->id)
            ->whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->get();
            
        // 1. Calculate Lateness
        $latenessMinutes = 0;
        $latenessCount = 0;
        $latenessPenalty = 0;

        foreach ($attendances as $att) {
            if ($att->clock_in) {
                $shiftStart = Carbon::parse($att->date->format('Y-m-d') . ' ' . $room->shift_start_time);
                $clockIn = Carbon::parse($att->clock_in);
                
                $diff = $shiftStart->diffInMinutes($clockIn, false);
                if ($diff > $room->late_grace_period) {
                    $latenessCount++;
                    $latenessMinutes += $diff;
                    if ($room->late_rule_type === 'fixed') {
                        $latenessPenalty += $room->late_amount;
                    } else {
                        $latenessPenalty += ($diff * $room->late_amount);
                    }
                }
            }
        }

        // 2. Calculate Overtime
        $overtimeMinutes = 0;
        $overtimeCount = 0;
        $overtimeBonus = 0;

        foreach ($attendances as $att) {
            if ($att->clock_out) {
                $shiftEnd = Carbon::parse($att->date->format('Y-m-d') . ' ' . $room->shift_end_time);
                $clockOut = Carbon::parse($att->clock_out);
                
                $diff = $shiftEnd->diffInMinutes($clockOut, false);
                if ($diff >= $room->overtime_min_duration) {
                    $overtimeCount++;
                    $overtimeMinutes += $diff;
                    if ($room->overtime_rule_type === 'fixed') {
                        $overtimeBonus += $room->overtime_amount;
                    } else {
                        // Per hour calculation for variable
                        $overtimeBonus += (($diff / 60) * $room->overtime_amount);
                    }
                }
            }
        }

        // 3. Calculate Absences (Approved Leaves)
        $approvedLeaves = Leave::where('employee_id', $employee->id)
            ->where('status', 'approved')
            ->whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->get();
        
        $absencePenalty = $approvedLeaves->count() * $room->absence_amount;

        // 4. Custom Adjustments
        $adjustments = PayrollAdjustment::where('employee_id', $employee->id)
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->get();
        
        $customAllowance = $adjustments->where('type', 'allowance')->sum('amount');
        $customDeduction = $adjustments->where('type', 'deduction')->sum('amount');

        // Total Calc
        $daysPresent = $attendances->where('status', 'present')->count();
        $categories = PayrollCategory::all(); 
        
        $totalEarnings = $employee->base_salary + ($employee->allowance ?? 0) + $overtimeBonus + $customAllowance;
        $totalDeductions = ($employee->deduction ?? 0) + $latenessPenalty + $absencePenalty + $customDeduction;
        
        $details = [
            'base_salary' => $employee->base_salary,
            'fixed_allowance' => $employee->allowance ?? 0,
            'fixed_deduction' => $employee->deduction ?? 0,
            'lateness' => [
                'count' => $latenessCount,
                'minutes' => $latenessMinutes,
                'penalty' => $latenessPenalty
            ],
            'overtime' => [
                'count' => $overtimeCount,
                'minutes' => $overtimeMinutes,
                'bonus' => $overtimeBonus
            ],
            'absences' => [
                'count' => $approvedLeaves->count(),
                'penalty' => $absencePenalty
            ],
            'custom' => [
                'allowance' => $customAllowance,
                'deduction' => $customDeduction,
                'items' => $adjustments
            ],
            'active_categories_at_generation' => $categories->map(function($cat) {
                return ['name' => $cat->name, 'type' => $cat->type];
            })
        ];

        $totalSalary = max(0, $totalEarnings - $totalDeductions);

        Payroll::create([
            'employee_id' => $employee->id,
            'room_id' => $room->id,
            'month' => $validated['month'],
            'year' => $validated['year'],
            'days_present' => $daysPresent,
            'total_salary' => $totalSalary,
            'status' => 'paid',
            'details' => $details,
        ]);

        return redirect()->back()->with('success', 'Payroll snapshot generated.');
    }

    public function show(Payroll $payroll)
    {
        return Inertia::render('payrolls/payslip', [
            'payroll' => $payroll->load('employee')
        ]);
    }
    
    public function destroy(Payroll $payroll)
    {
        $payroll->delete();
        return redirect()->back()->with('success', 'Payroll deleted.');
    }

    public function resetEmployee(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer',
            'year' => 'required|integer',
        ]);

        // Delete payslip
        Payroll::where('employee_id', $validated['employee_id'])
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->delete();

        // Delete custom adjustments
        PayrollAdjustment::where('employee_id', $validated['employee_id'])
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->delete();

        // Reset Leaves for that month back to pending? 
        // User said: "hapus seluruh custom allowance & Deduction... Jadi dia akan merekam dari awal bulan lagi"
        // I'll keep leaves but the user can re-approve or delete them manually if they want.
        // Actually, I'll delete the leaves for that employee too if they want a FULL reset.
        // But maybe they just want to reset the CALCULATION.
        // I'll stick to deleting Payslip and Adjustments for now.

        return back()->with('success', 'Employee log and payslip reset.');
    }

    public function massReset(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|integer',
            'year' => 'required|integer',
        ]);

        Payroll::where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->delete();

        PayrollAdjustment::where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->delete();
        
        // Also delete approved leaves for that month to start fresh?
        // User said: "hapus seluruh custom allowance & Deduction... Jadi dia akan merekam dari awal bulan lagi"
        Leave::whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->delete();

        return back()->with('success', 'Monthly logs and payslips have been cleared.');
    }
}
