<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use App\Models\Scopes\TenantScope;

#[ScopedBy([TenantScope::class])]
class PayrollAdjustment extends Model
{
    protected $fillable = [
        'employee_id',
        'room_id',
        'name',
        'amount',
        'type',
        'month',
        'year',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
