<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Player;
use Illuminate\Support\Facades\Log;

class PlayerController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validation with more detailed rules
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'poste' => 'required|string|max:255',
                'matches' => 'required|numeric|min:0',
                'passes' => 'required|numeric|min:0',
                'buts' => 'required|numeric|min:0',
                'note' => 'required|numeric|min:0',
                'maillot' => 'required|numeric|min:0',
                'image' => 'nullable|image|max:2048',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('players', 'public');
            }

            $player = Player::create([
                'name' => $validated['name'],
                'poste' => $validated['poste'],
                'matches' => (int)$validated['matches'],
                'passes' => (int)$validated['passes'],
                'buts' => (int)$validated['buts'],
                'note' => (float)$validated['note'],
                'maillot' => (int)$validated['maillot'],
                'image' => $imagePath,
            ]);

            return response()->json($player, 201);
            
        } catch (\Exception $e) {
            Log::error('Player creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating player: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        return response()->json(Player::all());
    }
}
