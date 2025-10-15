<?php
namespace App\Http\Controllers;

use App\Http\Requests\SkillRequest;
use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        return Skill::orderBy('name')->get();
    }

    public function store(SkillRequest $request)
    {
        return Skill::create($request->validated());
    }

    public function show(Skill $skill)
    {
        return $skill;
    }

    public function update(SkillRequest $request, Skill $skill)
    {
        $skill->update($request->validated());

        return $skill;
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->noContent();
    }

    public function publicIndex()
    {
        return Skill::orderBy('name')->get();
    }
}
