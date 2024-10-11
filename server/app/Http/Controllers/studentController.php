<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();

        if ($students->isEmpty()) {
            $data = [
                'status' => 'success',
                'message' => 'No se encontraron estudiantes',
            ];
            return response()->json($data, 200);
        }

        return response()->json($students, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:students'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['string', 'max:255'],
            'city' => ['string', 'max:255'],
            'state' => ['string', 'max:255'],
            'postal_code' => ['string', 'max:255'],
            'birth_date' => ['date'],
            'gender' => ['string', 'max:50'],
            'nationality' => ['string', 'max:255'],
        ]);

        if ($validator->fails()) {
            $data = [
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'No se pudo registrar el estudiante',
            ];
            return response()->json($data, 400);
        }

        $student = new Student();
        $student->first_name = $request->first_name;
        $student->last_name = $request->last_name;
        $student->email = $request->email;
        $student->phone = $request->phone;
        $student->address = $request->address;
        $student->city = $request->city;
        $student->state = $request->state;
        $student->postal_code = $request->postal_code;
        $student->birth_date = $request->birth_date;
        $student->gender = $request->gender;
        $student->nationality = $request->nationality;
        $student->save();

        if (!$student) {
            $data = [
                'status' => '404',
                'message' => 'No se pudo registrar el estudiante',
            ];
            return response()->json($data, 404);
        }

        $data = [
            'status' => 'success',
            'message' => 'Estudiante registrado exitosamente',
            'student' => $student,
        ];
        return response()->json($data, 200);
    }

    public function show($id)
    {
        $student = Student::find($id);

        if (!$student) {
            $data = [
                'status' => '404',
                'message' => 'No se encontró el estudiante',
            ];
            return response()->json($data, 404);
        }

        $data = [
            'status' => 'success',
            'message' => 'Estudiante encontrado exitosamente',
            'student' => $student,
        ];
        return response()->json($data, 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['string', 'max:255'],
            'city' => ['string', 'max:255'],
            'state' => ['string', 'max:255'],
            'postal_code' => ['string', 'max:255'],
            'birth_date' => ['date'],
            'gender' => ['string', 'max:50'],
            'nationality' => ['string', 'max:255'],
        ]);

        if ($validator->fails()) {
            $data = [
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'No se pudo actualizar el estudiante',
            ];
            return response()->json($data, 400);
        }

        $student = Student::find($id);
        $student->first_name = $request->first_name;
        $student->last_name = $request->last_name;
        $student->email = $request->email;
        $student->phone = $request->phone;
        $student->address = $request->address;
        $student->city = $request->city;
        $student->state = $request->state;
        $student->postal_code = $request->postal_code;
        $student->birth_date = $request->birth_date;
        $student->gender = $request->gender;
        $student->nationality = $request->nationality;
        $student->save();

        if (!$student) {
            $data = [
                'status' => '404',
                'message' => 'No se pudo actualizar el estudiante',
            ];
            return response()->json($data, 404);
        }

        $data = [
            'status' => 'success',
            'message' => 'Estudiante actualizado exitosamente',
            'student' => $student,
        ];
        return response()->json($data, 200);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            $data = [
                'status' => '404',
                'message' => 'No se pudo encontrar el estudiante',
            ];
            return response()->json($data, 404);
        }

        $student->delete();

        $data = [
            'status' => 'success',
            'message' => 'Estudiante eliminado exitosamente',
        ];
        return response()->json($data, 200);
    }

    public function updatePartial(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['string', 'max:255'],
            'last_name' => ['string', 'max:255'],
            'email' => ['string', 'email', 'max:255', 'unique:students'],
            'phone' => ['string', 'max:255'],
            'address' => ['string', 'max:255'],
            'city' => ['string', 'max:255'],
            'state' => ['string', 'max:255'],
            'postal_code' => ['string', 'max:255'],
            'birth_date' => ['date'],
            'gender' => ['string', 'max:50'],
            'nationality' => ['string', 'max:255'],
        ]);

        if ($validator->fails()) {
            $data = [
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'No se pudo actualizar el estudiante',
            ];
            return response()->json($data, 400);
        }

        $student = Student::find($id);
        if ($request->first_name) {
            $student->first_name = $request->first_name;
        }
        if ($request->last_name) {
            $student->last_name = $request->last_name;
        }
        if ($request->email) {
            $student->email = $request->email;
        }
        if ($request->phone) {
            $student->phone = $request->phone;
        }
        if ($request->address) {
            $student->address = $request->address;
        }
        if ($request->city) {
            $student->city = $request->city;
        }
        if ($request->state) {
            $student->state = $request->state;
        }
        if ($request->postal_code) {
            $student->postal_code = $request->postal_code;
        }
        if ($request->birth_date) {
            $student->birth_date = $request->birth_date;
        }
        if ($request->gender) {
            $student->gender = $request->gender;
        }
        if ($request->nationality) {
            $student->nationality = $request->nationality;
        }
        $student->save();

        $data = [
            'status' => 'success',
            'message' => 'Estudiante actualizado exitosamente',
            'student' => $student,
        ];
        return response()->json($data, 200);
    }
}
