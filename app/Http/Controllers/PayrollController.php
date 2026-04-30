<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function index()
    {
        $employeeIds = auth()->user()->employees()->pluck('id');

        return Inertia::render('payrolls/index', [
            'payrolls' => Payroll::with('employee')
                ->whereIn('employee_id', $employeeIds)
                ->latest()
                ->get(),
            'employees' => auth()->user()->employees()->get(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
            'days_present' => 'required|integer|min:0|max:31',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);

        // Security check
        if ($employee->user_id !== auth()->id()) {
            abort(403);
        }

        // Logic: (Base + Allowance) - Deduction
        $totalSalary = ($employee->base_salary + $employee->allowance) - $employee->deduction;

        Payroll::create([
            'employee_id' => $employee->id,
            'month' => $validated['month'],
            'year' => $validated['year'],
            'days_present' => $validated['days_present'],
            'total_salary' => $totalSalary,
            'status' => 'paid',
        ]);

        return redirect()->back();
    }

    public function show(Payroll $payroll)
    {
        // Security check
        if ($payroll->employee->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('payrolls/payslip', [
            'payroll' => $payroll->load('employee')
        ]);
    }
}
