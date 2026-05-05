<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Leave;
use App\Models\PayrollAdjustment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        if (auth('employee')->check()) {
            $employee = auth('employee')->user();
            return Inertia::render('employee/dashboard', [
                'employee' => $employee,
                'attendances' => $employee->attendances()->latest()->take(5)->get(),
                'payrolls' => $employee->payrolls()->latest()->take(5)->get(),
                'leaves' => $employee->leaves()->latest()->get(),
            ]);
        }

        // Admin Dashboard
        $user = auth('web')->user();
        $room = $user->room;
        
        $totalEmployees = Employee::count(); // Scoped automatically!
        
        $totalPayrollThisMonth = Payroll::where('month', now()->month)
            ->where('year', now()->year)
            ->sum('total_salary');
            
        $pendingProcess = $totalEmployees - Payroll::where('month', now()->month)
            ->where('year', now()->year)
            ->count();

        $employees = Employee::all();
        $payrolls = Payroll::with('employee')->latest()->get();
        $leaves = Leave::with('employee')->latest()->get();
        $adjustments = PayrollAdjustment::with('employee')
            ->where('month', now()->month)
            ->where('year', now()->year)
            ->get();

        return Inertia::render('dashboard', [
            'room' => $room,
            'categories' => \App\Models\PayrollCategory::all(),
            'employees' => $employees,
            'payrolls' => $payrolls,
            'leaves' => $leaves,
            'adjustments' => $adjustments,
            'stats' => [
                'total_employees' => $totalEmployees,
                'total_payroll' => $totalPayrollThisMonth,
                'pending_process' => max(0, $pendingProcess),
            ]
        ]);
    }
}
