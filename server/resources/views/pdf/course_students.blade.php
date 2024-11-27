<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Estudiantes - {{ $course->name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .header, .table-container {
            text-align: center;
            margin: 0 auto;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 16px;
            margin-bottom: 5px;
        }
        .table-container table {
            width: 80%;
            border-collapse: collapse;
            margin: 0 auto;
        }
        .table-container th, .table-container td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
        }
        .table-container th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
<div class="header">
        <h1>Curso: {{ $course->name }}</h1>
        <p>Descripción: {{ $course->description }}</p>
        <p>Duración: {{ $course->duration }} horas</p>
        <h2>Lista de Estudiantes</h2>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                @foreach($course->students as $index => $student)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $student->first_name }}</td>
                        <td>{{ $student->last_name }}</td>
                        <td>{{ $student->email }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
