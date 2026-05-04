<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        // Protected implicitly by TenantScope! No manual where() needed.
        return Inertia::render('employees/index', [
            'employees' => Employee::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        // In the new architecture, employees self-register using the Room Code.
        // Admins should not manually create them without emails/passwords.
        abort(403, 'Employees must self-register via the Room Code provided in the Dashboard.');
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'position' => 'required|string|max:255',
            'base_salary' => 'required|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
        ]);

        $employee->update($validated);

        return redirect()->back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->back()->with('success', 'Employee removed.');
    }
}
