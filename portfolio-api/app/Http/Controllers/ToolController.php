<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToolRequest;
use App\Http\Resources\ToolResource;
use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ToolController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $tools = Tool::with(['type', 'category'])->orderBy('name')->paginate($perPage);

        return ToolResource::collection($tools);
    }

    public function store(ToolRequest $request)
    {
        $tool = Tool::create($request->validated());

        return new ToolResource($tool->load(['type', 'category']));
    }

    public function show(Tool $tool)
    {
        return new ToolResource($tool->load(['type', 'category']));
    }

    public function update(ToolRequest $request, Tool $tool)
    {
        $tool->update($request->validated());

        return new ToolResource($tool->load(['type', 'category']));
    }

    public function destroy(Tool $tool)
    {
        $tool->delete();

        return response()->noContent();
    }

    public function publicIndex()
    {
        $tools = Tool::with(['type', 'category'])->orderBy('name')->get();

        return ToolResource::collection($tools);
    }
}
