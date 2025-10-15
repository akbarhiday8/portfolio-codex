<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToolCategoryRequest;
use App\Models\ToolCategory;

class ToolCategoryController extends Controller
{
    public function index()
    {
        return ToolCategory::orderBy('name')->get();
    }

    public function store(ToolCategoryRequest $request)
    {
        return ToolCategory::create($request->validated());
    }

    public function show(ToolCategory $toolCategory)
    {
        return $toolCategory;
    }

    public function update(ToolCategoryRequest $request, ToolCategory $toolCategory)
    {
        $toolCategory->update($request->validated());

        return $toolCategory;
    }

    public function destroy(ToolCategory $toolCategory)
    {
        $toolCategory->delete();

        return response()->noContent();
    }
}
