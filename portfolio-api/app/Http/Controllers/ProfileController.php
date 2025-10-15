<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $profiles = Profile::where('user_id', $request->user()->id)->get();

        return ProfileResource::collection($profiles);
    }

    public function store(UpdateProfileRequest $request)
    {
        $profile = $request->user()->profile()->create(
            $this->persist($request)
        );

        return new ProfileResource($profile);
    }

    public function update(UpdateProfileRequest $request, Profile $profile)
    {
        $profile->update($this->persist($request, $profile));

        return new ProfileResource($profile->refresh());
    }

    public function publicShow()
    {
        $profile = Profile::query()->first();

        if (! $profile) {
            return response()->json(null);
        }

        return new ProfileResource($profile);
    }

    protected function persist(UpdateProfileRequest $request, ?Profile $profile = null): array
    {
        $data = $request->safe()->except(['photo', 'cv', 'portfolio']);

        $fileMap = [
            'photo' => 'photo_path',
            'cv' => 'cv_path',
            'portfolio' => 'portfolio_file_path',
        ];

        foreach ($fileMap as $input => $column) {
            if ($file = $request->file($input)) {
                if ($profile && $profile->{$column}) {
                    Storage::disk('public')->delete($profile->{$column});
                }

                $data[$column] = $file->store('profile', 'public');
            }
        }

        return $data;
    }
}
