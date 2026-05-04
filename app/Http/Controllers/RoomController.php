<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    public function updateSettings(Request $request)
    {
        $request->validate([
            'shift_start_time' => 'required|date_format:H:i',
            'shift_end_time' => 'required|date_format:H:i',
            'lateness_penalty_per_minute' => 'required|numeric|min:0',
        ]);

        $room = $request->user()->room;
        $room->update($request->only('shift_start_time', 'shift_end_time', 'lateness_penalty_per_minute'));

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
