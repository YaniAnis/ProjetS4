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

    public function match()
    {
        return $this->belongsTo(Matches::class, 'match_id');
    }
}
