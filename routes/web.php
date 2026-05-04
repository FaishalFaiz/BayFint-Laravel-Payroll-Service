<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\PayrollCategoryController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('welcome', [
        'auth' => [
            'user' => auth('web')->user() ?? auth('employee')->user()
        ]
    ]);
})->name('home');

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::get('/register', [AdminAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AdminAuthController::class, 'register']);

    Route::get('/employee/login', [EmployeeAuthController::class, 'showLogin'])->name('employee.login');
    Route::post('/employee/login', [EmployeeAuthController::class, 'login']);
    Route::get('/employee/register', [EmployeeAuthController::class, 'showRegister'])->name('employee.register');
    Route::post('/employee/register', [EmployeeAuthController::class, 'register']);
});

Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
Route::post('/employee/logout', [EmployeeAuthController::class, 'logout'])->name('employee.logout');

// Protected Routes
Route::middleware('auth:web,employee')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Only Admin routes
    Route::middleware('auth:web')->group(function() {
        Route::put('/room/settings', [RoomController::class, 'updateSettings'])->name('room.settings.update');
        Route::post('/room/generate-code', [RoomController::class, 'generateCode'])->name('room.generate-code');
        
        Route::post('/categories', [PayrollCategoryController::class, 'store'])->name('categories.store');
        Route::delete('/categories/{category}', [PayrollCategoryController::class, 'destroy'])->name('categories.destroy');

        Route::resource('employees', EmployeeController::class);
        
        Route::get('payrolls', [PayrollController::class, 'index'])->name('payrolls.index');
        Route::post('payrolls', [PayrollController::class, 'store'])->name('payrolls.store');
        Route::get('payrolls/{payroll}', [PayrollController::class, 'show'])->name('payrolls.show');
        Route::delete('payrolls/{payroll}', [PayrollController::class, 'destroy'])->name('payrolls.destroy');
    });

    // Only Employee routes
    Route::middleware('auth:employee')->group(function() {
        Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
        Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('attendance.clock-out');
    });
});