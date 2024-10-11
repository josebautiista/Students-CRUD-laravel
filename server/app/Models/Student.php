<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'birth_date',
        'gender',
        'nationality',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'student_course')->withPivot('status');
    }
}
