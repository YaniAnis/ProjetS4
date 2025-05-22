<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'mode_paiement',
        'statut',
        'verification_code',
    ];

    // Relation to Ticket
    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
