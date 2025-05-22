<?php

// app/Models/Stade.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stade extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'lieu',
        'capacite',
    ];

    public function matchs()
    {
        return $this->hasMany(Matches::class);
    }
}

