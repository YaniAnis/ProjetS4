<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController; // Ensure this matches the actual namespace of UserController
use App\Http\Controllers\ActualityController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Models\User;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
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

Route::get('/users', [UserController::class, 'index']); // Ensure UserController exists in the specified namespace
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/user-stats', [UserController::class, 'getUserStats']);
Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);
Route::post('/verify-payment', [PaymentController::class, 'verifyPayment']);

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
    $user = \App\Models\User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['success' => false, 'message' => 'Utilisateur introuvable'], 404);
    }
    $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
    $user->save();
    // Optionally, remove the code from cache after successful reset
    Cache::forget('forgot_code_' . $request->email);
    return response()->json(['success' => true, 'message' => 'Mot de passe réinitialisé avec succès']);
});

Route::post('/register-send-code', [AuthController::class, 'sendRegisterCode']);
Route::post('/register-verify-code', [AuthController::class, 'verifyRegisterCode']);

Route::get('/check-email', function (\Illuminate\Http\Request $request) {
    $exists = User::where('email', $request->query('email'))->exists();
    return response()->json(['exists' => $exists]);
});
