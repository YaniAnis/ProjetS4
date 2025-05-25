<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'poste',
        'maillot',
        'matches',
        'buts',
        'passes',
        'note',
        'image'
    ];

    protected $casts = [
        'matches' => 'integer',
        'buts' => 'integer',
        'passes' => 'integer',
        'note' => 'decimal:1',
        'maillot' => 'integer'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        return env('APP_URL', 'http://localhost:8000') . '/storage/' . $this->image;
    }
}
