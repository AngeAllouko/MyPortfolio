<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'title', 'bio', 'email', 'phone', 
        'location', 'linkedin_url', 'github_url', 
        'photo_url', 'social_links'
    ];

    protected $casts = [
        'social_links' => 'array',
    ];
}