<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ToolResource extends JsonResource
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
            'tool_type_id' => $this->tool_type_id,
            'tool_category_id' => $this->tool_category_id,
            'icon_color' => $this->icon_color,
            'type' => $this->whenLoaded('type', fn () => $this->type->name),
            'category' => $this->whenLoaded('category', fn () => $this->category->name),
        ];
    }
}
