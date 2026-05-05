<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    protected static $isApplying = false;

    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (app()->runningInConsole() || static::$isApplying) {
            return;
        }

        static::$isApplying = true;

        try {
            if (Auth::guard('web')->check()) {
                $user = Auth::guard('web')->user();
                if ($user && $user->room) {
                    $builder->where($model->getTable() . '.room_id', $user->room->id);
                }
            } elseif (Auth::guard('employee')->check()) {
                $employee = Auth::guard('employee')->user();
                if ($employee && $employee->room_id) {
                    $builder->where($model->getTable() . '.room_id', $employee->room_id);
                }
            }
        } finally {
            static::$isApplying = false;
        }
    }
}
