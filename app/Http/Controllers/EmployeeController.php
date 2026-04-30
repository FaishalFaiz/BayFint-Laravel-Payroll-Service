<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        return Inertia::render('employees/index', [
            'employees' => auth()->user()->employees()->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'join_date' => 'required|date',
            'base_salary' => 'required|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
        ]);

        auth()->user()->employees()->create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Employee $employee)
    {
        // Security check: Ensure user owns the employee
        if ($employee->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'join_date' => 'required|date',
            'base_salary' => 'required|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
        ]);

        $employee->update($validated);

        return redirect()->back();
    }

    public function destroy(Employee $employee)
    {
        if ($employee->user_id !== auth()->id()) {
            abort(403);
        }

        $employee->delete();
        return redirect()->back();
    }
}
