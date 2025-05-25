<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\PlayerController;

Route::get('/test-db', function () {
    try {
        DB::connection()->getPdo();
        return "✅ Database is connected!";
    } catch (\Exception $e) {
        return "❌ Not connected: " . $e->getMessage();
    }
});

Route::get('/test-insert', function () {
    try {
        $user = \App\Models\User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        return $user ? '✅ User inserted successfully!' : '❌ Failed to insert user.';
    } catch (\Exception $e) {
        return '❌ Error: ' . $e->getMessage();
    }
});

Route::get('/', function () {
    return view('welcome'); // Ensure a 'welcome.blade.php' exists in the resources/views directory
});

Route::post('/api/players', [PlayerController::class, 'store']);
Route::get('/api/players', [PlayerController::class, 'index']);

