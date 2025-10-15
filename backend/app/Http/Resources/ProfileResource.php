<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'motto' => $this->motto,
            'about' => $this->about,
            'photo_url' => $this->photo_url,
            'cv_url' => $this->cv_url,
            'portfolio_file_url' => $this->portfolio_file_url,
            'updated_at' => $this->updated_at,
        ];
    }
}
