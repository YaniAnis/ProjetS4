<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Player;

class PlayerController extends Controller
{
    public function store(Request $request)
    {
        // Accept both JSON and multipart/form-data
        $isMultipart = $request->hasFile('image');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'poste' => 'required|string|max:255',
            'matches' => 'required|integer',
            'passes' => 'required|integer',
            'buts' => 'required|integer',
            'note' => 'required|numeric|min:0|max:10',
            'maillot' => 'required|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        // Save image if present
        $imagePath = null;
        if ($isMultipart && $request->file('image')) {
            $imagePath = $request->file('image')->store('players', 'public');
        }

        $player = Player::create([
            'name' => $validated['name'],
            'poste' => $validated['poste'],
            'matches' => $validated['matches'],
            'passes' => $validated['passes'],
            'buts' => $validated['buts'],
            'note' => $validated['note'],
            'maillot' => $validated['maillot'],
            'image' => $imagePath,
        ]);

        return response()->json($player, 201);
    }

    public function index()
    {
        return response()->json(Player::all());
    }
}
