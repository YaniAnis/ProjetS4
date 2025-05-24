<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Zone extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'name',
        'price',
        'places',
    ];

    // Ajoute une méthode d'accès pour garantir que places est toujours un entier >= 0
    public function getPlacesAttribute($value)
    {
        return max(0, (int) $value);
    }

    public function match()
    {
        return $this->belongsTo(Matches::class, 'match_id');
    }
}
