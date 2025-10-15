<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToolTypeRequest;
use App\Models\ToolType;

class ToolTypeController extends Controller
{
    public function index()
    {
        return ToolType::orderBy('name')->get();
    }

    public function store(ToolTypeRequest $request)
    {
        return ToolType::create($request->validated());
    }

    public function show(ToolType $toolType)
    {
        return $toolType;
    }

    public function update(ToolTypeRequest $request, ToolType $toolType)
    {
        $toolType->update($request->validated());

        return $toolType;
    }

    public function destroy(ToolType $toolType)
    {
        $toolType->delete();

        return response()->noContent();
    }
}
