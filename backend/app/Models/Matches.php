<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipe1',
        'equipe2',
        'date',
        'heure',
        'stade_id',
    ];

    // Relation to Stade
    public function stade()
    {
        return $this->belongsTo(Stade::class, 'stade_id');
    }

    // Accessors for stade attributes
    public function getLieuAttribute()
    {
        return $this->stade ? $this->stade->lieu : null;
    }

    public function getCapaciteAttribute()
    {
        return $this->stade ? $this->stade->capacite : null;
    }

    public function getNomStadeAttribute()
    {
        return $this->stade ? $this->stade->nom : null;
    }
}
