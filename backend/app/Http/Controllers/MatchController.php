<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use App\Models\Zone;
use App\Models\Stade;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index()
    {
        // Eager load stade and zones
        $matches = Matches::with(['stade', 'zones'])->get();

        // Log la structure des zones pour chaque match (optionnel)
        foreach ($matches as $match) {
            foreach ($match->zones as $zone) {
                \Log::info('Zone pour match ' . $match->id, [
                    'zone_id' => $zone->id,
                    'zone_name' => $zone->name,
                    'places' => $zone->places,
                    'zone_full' => $zone->toArray()
                ]);
            }
        }

        // Plus besoin de forcer la clé 'zones' si elle est toujours présente
        return response()->json($matches);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipe1' => 'required|string|max:255',
            'equipe2' => 'required|string|max:255',
            'league' => 'required|string|max:255',
            'date' => 'required|date',
            'heure' => 'required|string|max:10',
            // Accept either stade_id or new stadium data
            'stade_id' => 'nullable|exists:stades,id',
            'stade.nom' => 'required_without:stade_id|string|max:255',
            'stade.lieu' => 'required_without:stade_id|string|max:255',
            'stade.capacite' => 'required_without:stade_id|integer|min:1',
            'zones' => 'required|array|size:8',
            'zones.*.name' => 'required|string',
            'zones.*.price' => 'required|numeric|min:0',
            'zones.*.places' => 'required|integer|min:0',
        ]);

        // Determine stadium capacity
        $stade = null;
        if (!empty($validated['stade_id'])) {
            $stade = \App\Models\Stade::find($validated['stade_id']);
        } elseif (!empty($validated['stade'])) {
            $stade = new \App\Models\Stade($validated['stade']);
        }

        $zonesTotal = array_sum(array_column($validated['zones'], 'places'));
        if ($stade && $zonesTotal > $stade->capacite) {
            return response()->json([
                'message' => 'La somme des places des zones dépasse la capacité du stade sélectionné.'
            ], 422);
        }

        // Create stadium if not provided
        if (empty($validated['stade_id'])) {
            $stade = Stade::create([
                'nom' => $validated['stade']['nom'],
                'lieu' => $validated['stade']['lieu'],
                'capacite' => $validated['stade']['capacite'],
            ]);
            $stade_id = $stade->id;
        } else {
            $stade_id = $validated['stade_id'];
        }

        $match = Matches::create([
            'equipe1' => $validated['equipe1'],
            'equipe2' => $validated['equipe2'],
            'league' => $validated['league'],
            'date' => $validated['date'],
            'heure' => $validated['heure'],
            'stade_id' => $stade_id,
        ]);

        foreach ($validated['zones'] as $zone) {
            \App\Models\Zone::create([
                'match_id' => $match->id,
                'name' => $zone['name'],
                'price' => $zone['price'], // must be 'price', not 'prix'
                'places' => $zone['places'],
            ]);
        }

        return response()->json($match->load(['zones', 'stade']), 201);
    }

    public function show($id)
    {
        // Inclure les zones (et le stade) dans la réponse pour un match donné
        return response()->json(Matches::with(['stade', 'zones'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $match = Matches::find($id);
        if (!$match) {
            return response()->json(['message' => 'Match not found.'], 404);
        }

        $data = $request->validate([
            'equipe1' => 'sometimes|string',
            'equipe2' => 'sometimes|string',
            'stade_id' => 'sometimes|integer|exists:stades,id',
            'league' => 'sometimes|string',
            'date' => 'sometimes|date',
            'heure' => 'sometimes|string',
            // ...add more fields as needed...
        ]);

        $match->update($data);

        // If you want to update zones, handle it here (not shown for brevity)

        return response()->json(['message' => 'Match updated successfully.', 'match' => $match]);
    }

    public function destroy($id)
    {
        $match = Matches::find($id);
        if (!$match) {
            return response()->json(['message' => 'Match not found.'], 404);
        }
        // Delete related zones
        $match->zones()->delete();
        $match->delete();
        return response()->json(['message' => 'Match deleted successfully.']);
    }
}
