<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'description' => $this->description,
            'link_url' => $this->link_url,
            'project_category_id' => $this->project_category_id,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'features' => $this->whenLoaded('features', fn () => $this->features->pluck('text')),
            'tools' => ToolResource::collection($this->whenLoaded('tools')),
            'images' => $this->whenLoaded('images', fn () => $this->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'sort' => $image->sort,
                    'url' => $image->url,
                ];
            })),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
