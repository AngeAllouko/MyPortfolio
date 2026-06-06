<?php
// app/Models/Profile.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name', 'title', 'bio', 'email', 'phone',
        'location', 'linkedin_url', 'github_url',
        'photo_url', 'cv_url', 'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];
}