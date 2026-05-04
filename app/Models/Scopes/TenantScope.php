<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();
            if ($user->room) {
                $builder->where($model->getTable() . '.room_id', $user->room->id);
            }
        } elseif (Auth::guard('employee')->check()) {
            $employee = Auth::guard('employee')->user();
            if ($employee->room_id) {
                $builder->where($model->getTable() . '.room_id', $employee->room_id);
            }
        }
    }
}
