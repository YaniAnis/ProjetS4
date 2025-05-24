<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'match_id',
        'prix',
        'statut',
        'numero_place',
    ];

    // Relation to User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relation to Match
    public function match()
    {
        return $this->belongsTo(\App\Models\Matches::class, 'match_id');
    }
}
