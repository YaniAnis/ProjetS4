<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Match; // Ensure this line is correct and matches the namespace of the Match class
// If Match is in a different namespace, update the import accordingly.
// If the Match class is missing, create it in the appropriate namespace.

class Stade extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'lieu',
        'capacite',
    ];

    // Relation to Match
    public function matchs(){
        return $this->hasMany(\App\Models\Matches::class, 'stade_id'); // Use fully qualified namespace if necessary

    }
}
