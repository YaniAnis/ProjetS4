<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test-db', function () {
    try {
        DB::connection()->getPdo();
        return "✅ Database is connected!";
    } catch (\Exception $e) {
        return "❌ Not connected: " . $e->getMessage();
    }
});

Route::get('/', function () {
    return view('welcome'); // Ensure a 'welcome.blade.php' exists in the resources/views directory
});

