<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'code',
        'code_expires_at',
        'shift_start_time',
        'shift_end_time',
        'lateness_penalty_per_minute',
    ];

    protected function casts(): array
    {
        return [
            'code_expires_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrollCategories()
    {
        return $this->hasMany(PayrollCategory::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }
}
