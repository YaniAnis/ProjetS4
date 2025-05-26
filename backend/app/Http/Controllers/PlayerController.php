<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PlayerController extends Controller
{
    public function index()
    {
        // Ajout du champ image_url pour chaque joueur
        $players = Player::all()->map(function($player) {
            $playerArr = $player->toArray();
            $playerArr['image_url'] = $player->image
                ? url('/storage/' . ltrim($player->image, '/'))
                : null;
            return $playerArr;
        });
        return response()->json($players);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'poste' => 'required|string|max:50',
                'maillot' => 'required|integer|min:1|max:99',
                'matches' => 'required|integer|min:0',
                'buts' => 'required|integer|min:0',
                'passes' => 'required|integer|min:0',
                'note' => 'required|numeric|min:0|max:10',
                'image' => 'nullable|image|max:2048'
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('players', 'public');
                $validated['image'] = $path; // Store relative path
            }

            $player = Player::create($validated);
            
            return response()->json([
                'id' => $player->id,
                'name' => $player->name,
                'poste' => $player->poste,
                'matches' => $player->matches,
                'passes' => $player->passes, 
                'buts' => $player->buts,
                'note' => $player->note,
                'maillot' => $player->maillot,
                'image' => $player->image,
                'image_url' => $player->image_url // Include full URL
            ], 201);
        } catch (\Exception $e) {
            Log::error('Player creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating player: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $player = Player::findOrFail($id);
        $playerArr = $player->toArray();
        $playerArr['image_url'] = $player->image
            ? url('/storage/' . ltrim($player->image, '/'))
            : null;
        return response()->json($playerArr);
    }

    public function update(Request $request, $id)
    {
        $player = Player::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'poste' => 'sometimes|string|max:50',
            'maillot' => 'sometimes|integer|min:1|max:99',
            'matches' => 'sometimes|integer|min:0',
            'buts' => 'sometimes|integer|min:0',
            'passes' => 'sometimes|integer|min:0',
            'note' => 'sometimes|numeric|min:0|max:10',
            'image' => 'sometimes|nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($player->image) {
                Storage::disk('public')->delete($player->image);
            }
            $path = $request->file('image')->store('players', 'public');
            $validated['image'] = $path;
        }

        $player->update($validated);
        return response()->json($player);
    }

    public function destroy($id)
    {
        try {
            $player = Player::findOrFail($id);
            // Delete image if exists
            if ($player->image) {
                Storage::disk('public')->delete($player->image);
            }
            $player->delete();
            return response()->json(['message' => 'Player deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Player not found'], 404);
        }
    }
}
