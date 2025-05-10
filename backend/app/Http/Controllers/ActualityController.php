<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actuality;
use Illuminate\Support\Facades\Storage;

class ActualityController extends Controller
{
    public function index()
    {
        // Only return news (not matches)
        return response()->json(
            Actuality::where(function($q) {
                $q->where('type', 'news')->orWhereNull('type');
            })
            ->orderBy('created_at', 'desc')
            ->get()
        );
    }

    public function store(Request $request)
    {
        // Validate input for news
        $data = $request->validate([
            'title' => 'required|string|max:20',
            'content' => 'required|string|max:32',
            'description' => 'nullable|string',
            'readTime' => 'nullable|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        // Always set type to 'news' for actualities from ActualitePage.jsx
        $data['type'] = 'news';

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('actualities', 'public');
        }

        $actuality = Actuality::create($data);

        return response()->json($actuality, 201);
    }

    public function show($id)
    {
        $actuality = Actuality::findOrFail($id);
        return response()->json($actuality);
    }

    public function update(Request $request, $id)
    {
        $actuality = Actuality::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:20',
            'content' => 'sometimes|required|string|max:32',
            'description' => 'nullable|string',
            'readTime' => 'nullable|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($actuality->image) {
                Storage::disk('public')->delete($actuality->image);
            }
            $data['image'] = $request->file('image')->store('actualities', 'public');
        }

        $actuality->update($data);

        return response()->json($actuality);
    }

    public function destroy($id)
    {
        $actuality = Actuality::findOrFail($id);
        if ($actuality->image) {
            Storage::disk('public')->delete($actuality->image);
        }
        $actuality->delete();

        return response()->json(['message' => 'Actuality deleted']);
    }
}