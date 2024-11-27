<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::all();

        if ($teachers->isEmpty()) {
            $data = [
                'status' => 'success',
                'message' => 'No se encontraron profesores',
            ];
            return response()->json($data, 200);
        }

        return response()->json($teachers, 200);
    }

    public function getOne($id)
    {
        if ($id == '') {
            return null;
        }
        $teacher = Teacher::where('identificacion', $id)->first();

        if (!$teacher) {
            return null;
        }

        return response()->json($teacher, 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identificacion' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:teachers'],
            'phone' => ['required', 'string', 'max:10'],
            'address' => ['string', 'max:100'],
            'city' => ['string', 'max:255'],
            'state' => ['string', 'max:255'],
            'postal_code' => ['string', 'max:10'],
            'birth_date' => ['date'],
            'gender' => ['string', 'max:50'],
            'nationality' => ['string', 'max:255'],
        ]);

        if ($validator->fails()) {
            $data = [
                'status' => '400',
                'errors' => $validator->errors(),
                'message' => 'No se pudo registrar el profesor',
            ];
            return response()->json($data, 400);
        }

        $teacher = new Teacher();
        $teacher->identificacion = $request->identificacion;
        $teacher->first_name = $request->first_name;
        $teacher->last_name = $request->last_name;
        $teacher->email = $request->email;
        $teacher->phone = $request->phone;
        $teacher->address = $request->address;
        $teacher->city = $request->city;
        $teacher->state = $request->state;
        $teacher->postal_code = $request->postal_code;
        $teacher->birth_date = $request->birth_date;
        $teacher->gender = $request->gender;
        $teacher->nationality = $request->nationality;
        $teacher->save();

        if (!$teacher) {
            $data = [
                'status' => '404',
                'message' => 'No se pudo registrar el profesor',
            ];
            return response()->json($data, 404);
        }

        $data = [
            'status' => 'success',
            'message' => 'Profesor registrado exitosamente',
            'teacher' => $teacher,
        ];
        return response()->json($data, 200);
    }

    public function show($id)
    {
        $teacher = Teacher::find($id);

        if (!$teacher) {
            $data = [
                'status' => '404',
                'message' => 'No se encontró el profesor',
            ];
            return response()->json($data, 404);
        }

        $data = [
            'status' => 'success',
            'message' => 'Profesor encontrado exitosamente',
            'teacher' => $teacher,
        ];
        return response()->json($data, 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'identificacion' => ['required', 'string', 'max:255'],
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
                'message' => 'No se pudo actualizar el profesor',
            ];
            return response()->json($data, 400);
        }

        $teacher = Teacher::find($id);
        $teacher->identificacion = $request->identificacion;
        $teacher->first_name = $request->first_name;
        $teacher->last_name = $request->last_name;
        $teacher->email = $request->email;
        $teacher->phone = $request->phone;
        $teacher->address = $request->address;
        $teacher->city = $request->city;
        $teacher->state = $request->state;
        $teacher->postal_code = $request->postal_code;
        $teacher->birth_date = $request->birth_date;
        $teacher->gender = $request->gender;
        $teacher->nationality = $request->nationality;
        $teacher->save();

        if (!$teacher) {
            $data = [
                'status' => '404',
                'message' => 'No se pudo actualizar el profesor',
            ];
            return response()->json($data, 404);
        }

        $data = [
            'status' => 'success',
            'message' => 'Profesor actualizado exitosamente',
            'teacher' => $teacher,
        ];
        return response()->json($data, 200);
    }

    public function destroy($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            $data = [
                'status' => '404',
                'message' => 'No se pudo encontrar el profesor',
            ];
            return response()->json($data, 404);
        }

        $teacher->delete();

        $data = [
            'status' => 'success',
            'message' => 'Profesor eliminado exitosamente',
        ];
        return response()->json($data, 200);
    }

    public function updatePartial(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'identificacion' => ['string', 'max:255'],
            'first_name' => ['string', 'max:255'],
            'last_name' => ['string', 'max:255'],
            'email' => ['string', 'email', 'max:255', 'unique:teachers'],
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
                'message' => 'No se pudo actualizar el profesor',
            ];
            return response()->json($data, 400);
        }

        $teacher = Teacher::find($id);

        if ($request->identificacion) {
            $teacher->identificacion = $request->identificacion;
        }
        if ($request->first_name) {
            $teacher->first_name = $request->first_name;
        }
        if ($request->last_name) {
            $teacher->last_name = $request->last_name;
        }
        if ($request->email) {
            $teacher->email = $request->email;
        }
        if ($request->phone) {
            $teacher->phone = $request->phone;
        }
        if ($request->address) {
            $teacher->address = $request->address;
        }
        if ($request->city) {
            $teacher->city = $request->city;
        }
        if ($request->state) {
            $teacher->state = $request->state;
        }
        if ($request->postal_code) {
            $teacher->postal_code = $request->postal_code;
        }
        if ($request->birth_date) {
            $teacher->birth_date = $request->birth_date;
        }
        if ($request->gender) {
            $teacher->gender = $request->gender;
        }
        if ($request->nationality) {
            $teacher->nationality = $request->nationality;
        }
        $teacher->save();

        $data = [
            'status' => 'success',
            'message' => 'Profesor actualizado exitosamente',
            'teacher' => $teacher,
        ];
        return response()->json($data, 200);
    }
}
