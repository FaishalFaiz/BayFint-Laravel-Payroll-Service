<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use App\Models\Scopes\TenantScope;

#[ScopedBy([TenantScope::class])]
class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'room_id',
        'date',
        'clock_in',
        'clock_out',
        'status',
        'minutes_late',
        'lateness_penalty',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'clock_in' => 'datetime',
            'clock_out' => 'datetime',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
