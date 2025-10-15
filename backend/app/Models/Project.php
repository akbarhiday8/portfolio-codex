<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'link_url',
        'project_category_id',
    ];

    protected $with = ['images', 'features'];

    public function images()
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort');
    }

    public function features()
    {
        return $this->hasMany(Feature::class);
    }

    public function tools()
    {
        return $this->belongsToMany(Tool::class)->withTimestamps();
    }

    public function category()
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }
}
