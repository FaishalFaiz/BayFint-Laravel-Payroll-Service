<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use App\Models\Scopes\TenantScope;

#[ScopedBy([TenantScope::class])]
class PayrollCategory extends Model
{
    protected $fillable = [
        'room_id',
        'name',
        'type',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
