<?php

// app/Models/Match.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Matches extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipe1',
        'equipe2',
        'league',
        'date',
        'heure',
        'stade_id',
    ];

    public function stade()
    {
        return $this->belongsTo(Stade::class, 'stade_id');
    }

    public function zones()
    {
        return $this->hasMany(Zone::class, 'match_id');
    }

    // Utility: sum of all zones' capacities
    public function sumZonesCapacite()
    {
        return $this->zones()->sum('capacite');
    }


    public function isCapaciteValid()
    {
        return $this->stade && $this->sumZonesCapacite() == $this->stade->capacite;
    }
}
