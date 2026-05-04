<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('auth/employeeLogin');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('employee')->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showRegister()
    {
        return Inertia::render('auth/employeeRegister');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees',
            'password' => 'required|string|min:8|confirmed',
            'room_code' => 'required|string',
        ]);

        $room = Room::where('code', $request->room_code)
                    ->where('code_expires_at', '>', now())
                    ->first();

        if (!$room) {
            return back()->withErrors(['room_code' => 'Invalid or expired room code.']);
        }

        $employee = Employee::create([
            'room_id' => $room->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'position' => 'Staff',
            'join_date' => now(),
            'base_salary' => 0,
        ]);

        Auth::guard('employee')->login($employee);

        return redirect('/dashboard');
    }

    public function logout(Request $request)
    {
        Auth::guard('employee')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
