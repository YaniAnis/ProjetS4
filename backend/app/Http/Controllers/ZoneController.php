<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function updateSelectedCount(Request $request, $id)
    {
        $validated = $request->validate([
            'selected_count' => 'required|integer|min:0',
        ]);

        $zone = Zone::find($id);

        if (!$zone) {
            return response()->json(['message' => 'Zone introuvable.'], 404);
        }

        if ($zone->places < $validated['selected_count']) {
            return response()->json(['message' => 'Pas assez de places disponibles.'], 422);
        }

        $zone->places -= $validated['selected_count'];
        $zone->save();

        return response()->json(['message' => 'Places mises à jour avec succès.', 'zone' => $zone]);
    }
}
