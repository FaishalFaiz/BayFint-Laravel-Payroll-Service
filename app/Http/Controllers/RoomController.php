<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    public function updateSettings(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'shift_start_time' => 'required|date_format:H:i',
            'shift_end_time' => 'required|date_format:H:i',
            'late_grace_period' => 'required|integer|min:0',
            'overtime_min_duration' => 'required|integer|min:0',
            'late_rule_type' => 'required|in:fixed,variable',
            'late_amount' => 'required|numeric|min:0',
            'overtime_rule_type' => 'required|in:fixed,variable',
            'overtime_amount' => 'required|numeric|min:0',
            'absence_amount' => 'required|numeric|min:0',
        ]);

        $room = $request->user()->room;
        $room->update($request->only([
            'name', 'shift_start_time', 'shift_end_time', 
            'late_grace_period', 'overtime_min_duration', 
            'late_rule_type', 'late_amount', 
            'overtime_rule_type', 'overtime_amount', 
            'absence_amount'
        ]));

        return back()->with('success', 'Room settings updated.');
    }

    public function generateCode(Request $request)
    {
        $room = $request->user()->room;
        
        // Generate a 8-character random uppercase string
        $code = strtoupper(Str::random(8));
        
        $room->update([
            'code' => $code,
            'code_expires_at' => now()->addMinutes(30),
        ]);

        return back()->with('success', 'New room code generated.');
    }
}
