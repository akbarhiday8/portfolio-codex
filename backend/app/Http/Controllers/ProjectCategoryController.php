<?php

namespace App\Http\Controllers;

use App\Models\ProjectCategory;
use Illuminate\Http\Request;

class ProjectCategoryController extends Controller
{
    public function index()
    {
        return ProjectCategory::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:project_categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        return ProjectCategory::create($data);
    }

    public function show(ProjectCategory $projectCategory)
    {
        return $projectCategory;
    }

    public function update(Request $request, ProjectCategory $projectCategory)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:project_categories,name,' . $projectCategory->id],
            'description' => ['nullable', 'string'],
        ]);

        $projectCategory->update($data);

        return $projectCategory;
    }

    public function destroy(ProjectCategory $projectCategory)
    {
        abort_if($projectCategory->projects()->exists(), 422, 'Kategori masih digunakan oleh proyek.');

        $projectCategory->delete();

        return response()->noContent();
    }
}
