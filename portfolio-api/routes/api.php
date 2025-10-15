<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectCategoryController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ToolCategoryController;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\ToolTypeController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [ProjectController::class, 'stats']);

    Route::apiResource('profile', ProfileController::class)->only(['index', 'store', 'update']);
    Route::apiResource('skills', SkillController::class);
    Route::apiResource('tool-types', ToolTypeController::class);
    Route::apiResource('tool-categories', ToolCategoryController::class);
    Route::apiResource('tools', ToolController::class);
    Route::apiResource('project-categories', ProjectCategoryController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/images', [ProjectController::class, 'uploadImages']);
    Route::delete('projects/{project}/images/{image}', [ProjectController::class, 'deleteImage']);

    Route::put('/settings/account', [SettingController::class, 'updateAccount']);
});

Route::prefix('public')->middleware('throttle:60,1')->group(function () {
    Route::get('/profile', [ProfileController::class, 'publicShow']);
    Route::get('/skills', [SkillController::class, 'publicIndex']);
    Route::get('/tools', [ToolController::class, 'publicIndex']);
    Route::get('/projects', [ProjectController::class, 'publicIndex']);
    Route::get('/stats', [ProjectController::class, 'publicStats']);
});
