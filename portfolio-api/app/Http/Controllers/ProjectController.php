<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\Skill;
use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $projects = Project::with(['tools.type', 'tools.category', 'images', 'features', 'category'])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return ProjectResource::collection($projects);
    }

    public function store(ProjectRequest $request)
    {
        $project = DB::transaction(function () use ($request) {
            $project = Project::create($request->validated());
            $this->syncToolsAndFeatures($project, $request->validated());

            return $project;
        });

        return new ProjectResource($project->load(['tools.type', 'tools.category', 'features', 'images', 'category']));
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load(['tools.type', 'tools.category', 'features', 'images', 'category']));
    }

    public function update(ProjectRequest $request, Project $project)
    {
        DB::transaction(function () use ($request, $project) {
            $project->update($request->validated());
            $this->syncToolsAndFeatures($project, $request->validated());
        });

        return new ProjectResource($project->load(['tools.type', 'tools.category', 'features', 'images']));
    }

    public function destroy(Project $project)
    {
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $project->delete();

        return response()->noContent();
    }

    public function uploadImages(Request $request, Project $project)
    {
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $existing = $project->images()->count();
        $incoming = count($request->file('images', []));

        if ($existing + $incoming > 7) {
            return response()->json(['message' => 'Max 7 images per project'], 422);
        }

        $sort = $existing;

        foreach ($request->file('images', []) as $file) {
            $path = $file->store("projects/{$project->id}", 'public');
            $project->images()->create([
                'path' => $path,
                'sort' => $sort++,
            ]);
        }

        return new ProjectResource($project->load(['images']));
    }

    public function deleteImage(Project $project, ProjectImage $image)
    {
        abort_unless($image->project_id === $project->id, 404);

        Storage::disk('public')->delete($image->path);
        $image->delete();

        return response()->noContent();
    }

    public function stats()
    {
        return [
            'projects' => Project::count(),
            'skills' => Skill::count(),
            'tools' => Tool::count(),
        ];
    }

    public function publicIndex()
    {
        $projects = Project::with(['tools.type', 'tools.category', 'images', 'features', 'category'])
            ->orderByDesc('created_at')
            ->get();

        return ProjectResource::collection($projects);
    }

    public function publicStats()
    {
        return $this->stats();
    }

    protected function syncToolsAndFeatures(Project $project, array $data): void
    {
        $project->tools()->sync($data['tool_ids'] ?? []);

        $project->features()->delete();
        foreach ($data['features'] ?? [] as $text) {
            $project->features()->create(['text' => $text]);
        }
    }
}
