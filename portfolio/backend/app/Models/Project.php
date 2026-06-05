<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'technologies', 
        'image_url', 'github_link', 'live_link', 'featured'
    ];

    protected $casts = [
        'technologies' => 'array',
        'featured' => 'boolean',
    ];
}