<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'reason' => 'required|string',
        ]);

        $employee = auth('employee')->user();

        Leave::create([
            'employee_id' => $employee->id,
            'room_id' => $employee->room_id,
            'date' => $validated['date'],
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Absence request submitted.');
    }

    public function update(Request $request, Leave $leave)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $leave->update(['status' => $validated['status']]);

        return back()->with('success', 'Leave request updated.');
    }
}
