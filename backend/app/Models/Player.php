<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', // use id instead of numero
        'name',
        'poste',
        'matches',
        'passes',
        'buts',
        'note',
        'maillot',
        'image', // Add image to fillable
    ];
}
