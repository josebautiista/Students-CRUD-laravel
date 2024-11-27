<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'duration', 'teacher_id'];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_course')->withPivot('status');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
