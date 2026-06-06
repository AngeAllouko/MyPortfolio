<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DiplomaController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ContactController;

Route::group([], function () {

    Route::get('profile',         [ProfileController::class, 'show']);
    Route::post('profile',        [ProfileController::class, 'store']);
    Route::post('profile/{id}',   [ProfileController::class, 'update']); // ← POST avec _method=PUT
    Route::put('profile/{id}',    [ProfileController::class, 'update']); // ← garde aussi PUT classique


    // Profile (généralement une seule entrée)
    Route::apiResource('profile', ProfileController::class)->except(['destroy']);
    Route::get('profile', [ProfileController::class, 'show']);

    // Diplomas
    Route::apiResource('diplomas', DiplomaController::class);

    // Experiences
    Route::apiResource('experiences', ExperienceController::class);

    // Skills
    Route::apiResource('skills', SkillController::class);

    // Projects
    Route::apiResource('projects', ProjectController::class);

    // Contacts (formulaire de contact)
    Route::apiResource('contacts', ContactController::class);
});