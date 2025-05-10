<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController; // Ensure this matches the actual namespace of UserController
use App\Http\Controllers\ActualityController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/actualities', [ActualityController::class, 'index']);
Route::post('/actualities', [ActualityController::class, 'store']);
Route::get('/actualities/{id}', [ActualityController::class, 'show']);
Route::put('/actualities/{id}', [ActualityController::class, 'update']);
Route::delete('/actualities/{id}', [ActualityController::class, 'destroy']);

Route::get('/users', [UserController::class, 'index']); // Ensure UserController exists in the specified namespace
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/user-stats', [UserController::class, 'getUserStats']);
