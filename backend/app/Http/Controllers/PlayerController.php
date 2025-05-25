<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Player;

class PlayerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'poste' => 'required|string|max:255',
            'numero' => 'required|integer',
            'matches' => 'required|integer',
            'passes' => 'required|integer',
            'buts' => 'required|integer',
            'note' => 'required|numeric|min:0|max:10',
            'maillot' => 'required|integer',
        ]);

        $player = Player::create($validated);

        return response()->json($player, 201);
    }

    public function index()
    {
        return response()->json(Player::all());
    }
}
