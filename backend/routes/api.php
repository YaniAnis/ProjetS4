<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActualityController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\MatchController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ZoneController;

Route::middleware('auth:sanctum')->get('/user', function (\Illuminate\Http\Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/actualities', [ActualityController::class, 'index']);
Route::post('/actualities', [ActualityController::class, 'store']);
Route::get('/actualities/{id}', [ActualityController::class, 'show']);
Route::put('/actualities/{id}', [ActualityController::class, 'update']);
Route::delete('/actualities/{id}', [ActualityController::class, 'destroy']);

Route::get('/users', [UserController::class, 'index']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/user-stats', [UserController::class, 'getUserStats']);
Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);
Route::post('/verify-payment', [PaymentController::class, 'verifyPayment']);
Route::post('/send-ticket', [\App\Http\Controllers\PaymentController::class, 'sendTicketByEmail']);

Route::get('/matches', [MatchController::class, 'index']);
Route::post('/matches', [MatchController::class, 'store']);
Route::get('/matches/{id}', [MatchController::class, 'show']);
Route::put('/matches/{id}', [MatchController::class, 'update']);
Route::delete('/matches/{id}', [MatchController::class, 'destroy']);

Route::get('/stades', function () {
    return \App\Models\Stade::all();
});

Route::post('/forgot-password-code', function (\Illuminate\Http\Request $request) {
    $request->validate(['email' => 'required|email']);
    $code = rand(100000, 999999);
    Cache::put('forgot_code_' . $request->email, $code, 600);
    Mail::raw("Votre code de réinitialisation est : $code", function($msg) use ($request) {
        $msg->to($request->email)->subject('Code de réinitialisation');
    });
    return response()->json(['message' => 'Code envoyé']);
});

Route::post('/verify-forgot-code', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'email' => 'required|email',
        'code' => 'required'
    ]);
    $cachedCode = Cache::get('forgot_code_' . $request->email);
    if ($cachedCode && strval($request->code) === strval($cachedCode)) {
        return response()->json(['success' => true]);
    } else {
        return response()->json(['success' => false, 'message' => 'Code incorrect'], 400);
    }
});

Route::post('/reset-password', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:8',
        'code' => 'required'
    ]);
    $cachedCode = Cache::get('forgot_code_' . $request->email);
    if (!$cachedCode || strval($request->code) !== strval($cachedCode)) {
        return response()->json(['success' => false, 'message' => 'Code incorrect'], 400);
    }
    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['success' => false, 'message' => 'Utilisateur introuvable'], 404);
    }
    $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
    $user->save();
    Cache::forget('forgot_code_' . $request->email);
    return response()->json(['success' => true, 'message' => 'Mot de passe réinitialisé avec succès']);
});

Route::post('/register-send-code', function (\Illuminate\Http\Request $request) {
    try {
        return app(\App\Http\Controllers\AuthController::class)->sendRegisterCode($request);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi du code : ' . $e->getMessage(),
        ], 500);
    }
});
Route::post('/register-verify-code', [AuthController::class, 'verifyRegisterCode']);

Route::get('/check-email', function (\Illuminate\Http\Request $request) {
    $exists = User::where('email', $request->query('email'))->exists();
    return response()->json(['exists' => $exists]);
});

Route::middleware('auth:sanctum')->put('/user/password', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    $request->validate([
        'old_password' => 'required',
        'password' => 'required|string|min:8|confirmed',
    ]);
    if (!\Illuminate\Support\Facades\Hash::check($request->old_password, $user->password)) {
        return response()->json(['message' => 'Ancien mot de passe incorrect.'], 422);
    }
    $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
    $user->save();
    return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
});

Route::middleware('auth:sanctum')->delete('/user/delete', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    $request->validate([
        'password' => 'required',
    ]);
    if (!\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Mot de passe incorrect.'], 422);
    }
    $user->delete();
    return response()->json(['message' => 'Compte supprimé avec succès.']);
});

Route::middleware('auth:sanctum')->put('/user/update', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $user->id,
    ]);
    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();
    return response()->json(['message' => 'Profil mis à jour', 'user' => $user]);
});

// Send code to new email
Route::post('/send-change-email-code', function (\Illuminate\Http\Request $request) {
    $request->validate(['email' => 'required|email']);
    $code = rand(100000, 999999);
    Cache::put('change_email_code_' . $request->email, $code, 600);
    Mail::raw("Votre code de vérification FooTiX pour changer d'email est : $code", function($msg) use ($request) {
        $msg->to($request->email)->subject('Code de vérification changement d\'email FooTiX');
    });
    return response()->json(['message' => 'Code envoyé']);
});

// Change email after code verification
Route::middleware('auth:sanctum')->put('/change-email', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    $request->validate([
        'email' => 'required|email|unique:users,email,' . $user->id,
        'code' => 'required'
    ]);
    $cachedCode = Cache::get('change_email_code_' . $request->email);
    if ($cachedCode && strval($request->code) === strval($cachedCode)) {
        $user->email = $request->email;
        $user->save();
        Cache::forget('change_email_code_' . $request->email);
        return response()->json(['message' => 'Email mis à jour avec succès.']);
    } else {
        return response()->json(['message' => 'Code incorrect ou expiré.'], 400);
    }
});

Route::middleware('auth:sanctum')->post('/tickets', [TicketController::class, 'store']);
Route::middleware('auth:sanctum')->get('/my-tickets', [TicketController::class, 'userTickets']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/create-payment', [PaymentController::class, 'createPayment']);
});
Route::get('/payments', [PaymentController::class, 'index']);

Route::post('/zones/{id}/update', [ZoneController::class, 'updateSelectedCount']);
