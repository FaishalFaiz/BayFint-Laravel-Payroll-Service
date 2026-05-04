<?php

namespace App\Http\Controllers;

use App\Models\PayrollCategory;
use Illuminate\Http\Request;

class PayrollCategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:earning,deduction',
        ]);

        PayrollCategory::create([
            'room_id' => $request->user()->room->id,
            'name' => $request->name,
            'type' => $request->type,
        ]);

        return back()->with('success', 'Payroll category added.');
    }

    public function destroy(PayrollCategory $category)
    {
        // Add authorization to ensure the admin owns this category
        if ($category->room_id !== request()->user()->room->id) {
            abort(403);
        }
        
        $category->delete();
        return back()->with('success', 'Payroll category removed.');
    }
}
