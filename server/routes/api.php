<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\studentController;
use App\Http\Controllers\courseController;

Route::get('/students', [studentController::class, 'index']);
Route::get('/students/{id}', [studentController::class, 'show']);
Route::post('/students', [studentController::class, 'store']);
Route::put('/students/{id}', [studentController::class, 'update']);
Route::delete('/students/{id}', [studentController::class, 'destroy']);
Route::patch('/students/{id}', [studentController::class, 'updatePartial']);

Route::get('/courses', [courseController::class, 'index']);
Route::get('/courses/{id}', [courseController::class, 'show']);
Route::post('/courses', [courseController::class, 'store']);
Route::put('/courses/{id}', [courseController::class, 'update']);
Route::delete('/courses/{id}', [courseController::class, 'destroy']);
Route::post('/courses/{id}/students', [courseController::class, 'attachStudents']);
Route::delete('/courses/{id}/students', [courseController::class, 'detachStudents']);
