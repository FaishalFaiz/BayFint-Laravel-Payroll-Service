<?php

namespace App\Http\Controllers;

use App\Models\PayrollAdjustment;
use Illuminate\Http\Request;

class PayrollAdjustmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'type' => 'required|in:allowance,deduction',
        ]);

        $room = auth()->user()->room;

        PayrollAdjustment::create([
            'employee_id' => $validated['employee_id'],
            'room_id' => $room->id,
            'name' => $validated['name'],
            'amount' => $validated['amount'],
            'type' => $validated['type'],
            'month' => now()->month,
            'year' => now()->year,
        ]);

        return back()->with('success', 'Custom adjustment added.');
    }

    public function destroy(PayrollAdjustment $adjustment)
    {
        $adjustment->delete();
        return back()->with('success', 'Adjustment deleted.');
    }
}
