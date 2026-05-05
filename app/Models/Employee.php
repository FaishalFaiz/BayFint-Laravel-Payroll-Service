<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use App\Models\Scopes\TenantScope;

#[ScopedBy([TenantScope::class])]
class Employee extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'room_id',
        'name',
        'email',
        'password',
        'position',
        'join_date',
        'base_salary',
        'allowance',
        'deduction',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

    public function adjustments()
    {
        return $this->hasMany(PayrollAdjustment::class);
    }
}
