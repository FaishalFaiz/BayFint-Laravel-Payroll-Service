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
        $user = auth()->user();
        
        // Only get data for the authenticated user
        $employeeIds = $user->employees()->pluck('id');
        
        $totalEmployees = $user->employees()->count();
        $totalPayrollThisMonth = Payroll::whereIn('employee_id', $employeeIds)
            ->where('month', now()->month)
            ->where('year', now()->year)
            ->sum('total_salary');
            
        $pendingProcess = $totalEmployees - Payroll::whereIn('employee_id', $employeeIds)
            ->where('month', now()->month)
            ->where('year', now()->year)
            ->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_employees' => $totalEmployees,
                'total_payroll' => $totalPayrollThisMonth,
                'pending_process' => max(0, $pendingProcess),
            ]
        ]);
    }
}
