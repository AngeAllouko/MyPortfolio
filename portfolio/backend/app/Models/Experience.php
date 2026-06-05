<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_title', 'company', 'start_date', 
        'end_date', 'description', 'location'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}