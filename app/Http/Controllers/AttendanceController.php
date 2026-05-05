<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function clockIn(Request $request)
    {
        $employee = auth('employee')->user();
        $room = $employee->room;
        
        $today = Carbon::today()->toDateString();
        
        $existing = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            return back()->withErrors(['clock_in' => 'You have already clocked in today.']);
        }

        $now = Carbon::now();
        $shiftStart = Carbon::parse($today . ' ' . $room->shift_start_time);
        
        $minutesLate = 0;
        $diff = $shiftStart->diffInMinutes($now, false);
        if ($diff > $room->late_grace_period) {
            $minutesLate = $diff;
        }

        Attendance::create([
            'employee_id' => $employee->id,
            'room_id' => $room->id,
            'date' => $today,
            'clock_in' => $now,
            'status' => 'present',
            'minutes_late' => $minutesLate,
            'lateness_penalty' => 0, // Calculated at generation time
        ]);

        return back()->with('success', 'Successfully clocked in at ' . $now->format('H:i'));
    }

    public function clockOut(Request $request)
    {
        $employee = auth('employee')->user();
        $today = Carbon::today()->toDateString();
        
        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            return back()->withErrors(['clock_out' => 'You need to clock in first.']);
        }

        if ($attendance->clock_out) {
            return back()->withErrors(['clock_out' => 'You have already clocked out today.']);
        }

        $attendance->update([
            'clock_out' => Carbon::now(),
        ]);

        return back()->with('success', 'Successfully clocked out at ' . Carbon::now()->format('H:i'));
    }
}
