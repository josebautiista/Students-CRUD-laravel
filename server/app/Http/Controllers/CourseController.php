<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('students')->get();

        if ($courses->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No se encontraron cursos',
            ], 200);
        }

        return response()->json($courses, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'duration' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'No se pudo registrar el curso',
            ], 400);
        }

        $course = new Course();
        $course->name = $request->name;
        $course->description = $request->description;
        $course->duration = $request->duration;
        $course->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Curso registrado exitosamente',
            'course' => $course,
        ], 200);
    }

    public function show($id)
    {
        $course = Course::with('students')->find($id);

        if (!$course) {
            return response()->json([
                'status' => '404',
                'message' => 'No se encontró el curso',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Curso encontrado exitosamente',
            'course' => $course,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'duration' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'No se pudo actualizar el curso',
            ], 400);
        }

        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status' => '404',
                'message' => 'No se encontró el curso',
            ], 404);
        }

        $course->name = $request->name;
        $course->description = $request->description;
        $course->duration = $request->duration;
        $course->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Curso actualizado exitosamente',
            'course' => $course,
        ], 200);
    }

    public function destroy($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status' => '404',
                'message' => 'No se pudo encontrar el curso',
            ], 404);
        }

        $course->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Curso eliminado exitosamente',
        ], 200);
    }

    public function attachStudents(Request $request, $courseId)
    {
        $validator = Validator::make($request->all(), [
            'students' => ['required', 'array'],
            'students.*' => ['exists:students,id'],
            'status' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'Datos no válidos',
            ], 400);
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'status' => '404',
                'message' => 'Curso no encontrado',
            ], 404);
        }

        foreach ($request->students as $studentId) {
            $course->students()->attach($studentId, ['status' => $request->status]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Estudiantes asociados al curso exitosamente',
        ], 200);
    }

    public function detachStudents(Request $request, $courseId)
    {
        $validator = Validator::make($request->all(), [
            'students' => ['required', 'array'],
            'students.*' => ['exists:students,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'Datos no válidos',
            ], 400);
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'status' => '404',
                'message' => 'Curso no encontrado',
            ], 404);
        }

        $course->students()->detach($request->students);

        return response()->json([
            'status' => 'success',
            'message' => 'Estudiantes desasociados del curso exitosamente',
        ], 200);
    }
}
