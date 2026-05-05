<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
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

        return Inertia::render('dashboard', [
            'room' => $room,
            'categories' => \App\Models\PayrollCategory::all(),
            'employees' => Employee::all(),
            'payrolls' => Payroll::with('employee')->latest()->get(),
            'stats' => [
                'total_employees' => $totalEmployees,
                'total_payroll' => $totalPayrollThisMonth,
                'pending_process' => max(0, $pendingProcess),
            ]
        ]);
    }
}
