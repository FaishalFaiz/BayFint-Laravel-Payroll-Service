<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Attendance;
use App\Models\PayrollCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            
        $daysPresent = $attendances->where('status', 'present')->count();
        $totalLatenessPenalty = $attendances->sum('lateness_penalty');

        $categories = PayrollCategory::all(); 
        
        $totalEarnings = $employee->base_salary + ($employee->allowance ?? 0);
        $totalDeductions = ($employee->deduction ?? 0) + $totalLatenessPenalty;
        
        $details = [
            'base_salary' => $employee->base_salary,
            'fixed_allowance' => $employee->allowance ?? 0,
            'fixed_deduction' => $employee->deduction ?? 0,
            'days_present' => $daysPresent,
            'total_lateness_penalty' => $totalLatenessPenalty,
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
}
