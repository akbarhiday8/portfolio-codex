<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Tool extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon_color',
        'tool_type_id',
        'tool_category_id',
    ];

    protected $appends = ['icon_color'];
    protected $hidden = ['pivot', 'created_at', 'updated_at'];

    public function type()
    {
        return $this->belongsTo(ToolType::class, 'tool_type_id');
    }

    public function category()
    {
        return $this->belongsTo(ToolCategory::class, 'tool_category_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class)->withTimestamps();
    }

    public function getIconColorAttribute(): string
    {
        return $this->attributes['icon_color'] ?? '#1f2937';
    }
}
