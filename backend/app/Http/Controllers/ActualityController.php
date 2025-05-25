<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actuality;
use Illuminate\Support\Facades\Storage;

class ActualityController extends Controller
{
    public function index()
    {
        $actualities = \App\Models\Actuality::orderBy('created_at', 'desc')->get();
        $actualities->transform(function ($a) {
            if ($a->image_url && !str_starts_with($a->image_url, '/storage/')) {
                $a->image_url = '/storage/' . ltrim($a->image_url, '/');
            }
            // Ensure the URL is never null
            if (!$a->image_url) {
                $a->image_url = null;
            }
            return $a;
        });
        return response()->json($actualities);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string', // autorise du texte long
            'description' => 'nullable|string',
            'readTime' => 'nullable|string',
            'image' => 'nullable|image|max:4096',
        ]);

        $actuality = new \App\Models\Actuality();
        $actuality->title = $request->title;
        $actuality->content = $request->content;
        $actuality->description = $request->description;
        $actuality->readTime = $request->readTime;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('actualities', 'public');
            $actuality->image_url = '/storage/' . $path;
        }

        $actuality->save();

        return response()->json([
            'success' => true,
            'actuality' => $actuality
        ]);
    }

    public function show($id)
    {
        $actuality = Actuality::findOrFail($id);
        if ($actuality->image_url && !str_starts_with($actuality->image_url, '/storage/')) {
            $actuality->image_url = '/storage/' . ltrim($actuality->image_url, '/');
        }
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
            // Delete old image if exists
            if ($actuality->image_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $actuality->image_url));
            }
            // Store new image
            $path = $request->file('image')->store('actualities', 'public');
            $data['image_url'] = '/storage/' . $path; // Use image_url instead of image
        }

        $actuality->update($data);
        return response()->json($actuality);
    }

    public function destroy($id)
    {
        $actuality = Actuality::findOrFail($id);
        if ($actuality->image_url) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $actuality->image_url));
        }
        $actuality->delete();
        return response()->json(['message' => 'Actuality deleted']);
    }
}