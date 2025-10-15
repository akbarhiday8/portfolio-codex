<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'title',
        'motto',
        'about',
        'photo_path',
        'cv_path',
        'portfolio_file_path',
    ];

    protected $appends = ['photo_url', 'cv_url', 'portfolio_file_url'];

    protected $hidden = ['photo_path', 'cv_path', 'portfolio_file_path'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null;
    }

    public function getCvUrlAttribute(): ?string
    {
        return $this->cv_path ? Storage::disk('public')->url($this->cv_path) : null;
    }

    public function getPortfolioFileUrlAttribute(): ?string
    {
        return $this->portfolio_file_path ? Storage::disk('public')->url($this->portfolio_file_path) : null;
    }
}
