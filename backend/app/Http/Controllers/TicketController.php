<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'match_id' => 'required|exists:matches,id',
            'zone_name' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'numero_place' => 'nullable|string',
        ]);

        // Find the zone for the match and zone_name
        $zone = Zone::where('match_id', $validated['match_id'])
            ->where('name', $validated['zone_name'])
            ->first();

        if (!$zone || $zone->places <= 0) {
            return response()->json(['message' => 'Zone non disponible ou complète.'], 422);
        }

        // Decrement available places
        $zone->places -= 1;
        $zone->save();

        $ticket = Ticket::create([
            'user_id' => Auth::id() ?? 1, // fallback for testing
            'match_id' => $validated['match_id'],
            'prix' => $validated['prix'],
            'statut' => 'valide',
            'numero_place' => $validated['numero_place'] ?? null,
        ]);

        return response()->json($ticket, 201);
    }

    public function userTickets(Request $request)
    {
        $user = Auth::user();
        $tickets = Ticket::where('user_id', $user->id)->with(['match', 'match.stade'])->get();
        return response()->json($tickets);
    }

    public function userTicketsCount(Request $request)
    {
        $userId = $request->query('user_id');
        $matchId = $request->query('match_id');
        $count = \App\Models\Ticket::where('user_id', $userId)
            ->where('match_id', $matchId)
            ->where('statut', '!=', 'annulé') // optionnel : ne compte pas les tickets annulés
            ->sum(\DB::raw("COALESCE(nb_places, 1)")); // si vous avez un champ nb_places, sinon count()
        return response()->json(['count' => $count]);
    }
}
