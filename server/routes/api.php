<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\studentController;
use App\Http\Controllers\courseController;
use App\Http\Controllers\TeacherController;

Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
Route::patch('/teachers/{id}', [TeacherController::class, 'updatePartial']);
Route::get('/teachers', [TeacherController::class, 'index']);
Route::get('/teachers/{id}', [TeacherController::class, 'getOne']);
Route::post('/courses/{id}/teachers', [CourseController::class, 'attachTeachers']);
Route::post('/teachers', [TeacherController::class, 'store'])->name('teachers.store');
Route::get('/courses/{id}/download', [CourseController::class, 'downloadStudentList'])->name('courses.download');
Route::get('/students', [studentController::class, 'index']);
Route::get('/students/{id}', [studentController::class, 'show']);
Route::post('/students', [studentController::class, 'store']);
Route::put('/students/{id}', [studentController::class, 'update']);
Route::put('/teachers/{id}', [TeacherController::class, 'update']);
Route::delete('/students/{id}', [studentController::class, 'destroy']);
Route::patch('/students/{id}', [studentController::class, 'updatePartial']);

Route::get('/courses', [courseController::class, 'index']);
Route::get('/courses/{id}', [courseController::class, 'show']);
Route::post('/courses', [courseController::class, 'store']);
Route::put('/courses/{id}', [courseController::class, 'update']);
Route::delete('/courses/{id}', [courseController::class, 'destroy']);
Route::post('/courses/{id}/students', [courseController::class, 'attachStudents']);
Route::delete('/courses/{id}/students', [courseController::class, 'detachStudents']);
