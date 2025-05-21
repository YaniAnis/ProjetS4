<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Register endpoint hit', ['data' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Only check for existing email if NOT just after code verification
        // If you want to allow only one registration per email, keep this check.
        // If you want to allow registration only after code verification, you should remove this check here
        // and rely on the frontend to prevent double registration attempts.

        // Check if email already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Un compte avec cet email existe déjà.'], 409);
        }

        // Remove the code above and instead check if the code was verified:
        $cachedCode = Cache::get('register_code_' . $request->email);
        if (!$cachedCode) {
            return response()->json(['message' => 'Veuillez vérifier votre email avant de créer un compte.'], 409);
        }
        // Remove the code after successful registration
        Cache::forget('register_code_' . $request->email);

        try {
            // Log the email and subject before sending
            Log::info('Sending welcome email', [
                'to' => $request->email,
                'subject' => 'Bienvenue chez FooTiX !'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => ucfirst('user'),
            ]);

            if (!$user) {
                throw new \Exception('Failed to save user');
            }

            // Flush mail queue and send immediately (force sync)
            try {
                Mail::mailer('smtp')->raw('Bienvenue chez FooTiX ! ⚽🎟️

Votre compte a été créé avec succès. Vous pouvez désormais réserver vos places pour les plus grands matchs et vibrer au rythme du football en quelques clics !

N’attendez plus pour consulter le calendrier des rencontres et profiter des meilleures offres.

À très vite dans les tribunes avec FooTiX !

- L’équipe FooTiX', function($msg) use ($user) {
                    $msg->to($user->email)
                        ->subject('Bienvenue chez FooTiX !');
                });
                Log::info('Welcome email sent', ['to' => $user->email]);
            } catch (\Exception $mailEx) {
                Log::error('Erreur lors de l\'envoi du mail', ['error' => $mailEx->getMessage()]);
                return response()->json([
                    'message' => 'Erreur lors de l\'envoi du mail : ' . $mailEx->getMessage(),
                    'error' => $mailEx->getMessage()
                ], 500);
            }

            Log::info('User created successfully', ['user' => $user]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed', ['error' => $e->getMessage()]);
            // For debugging, return the actual error message:
            return response()->json(['message' => 'An error occurred during registration.', 'error' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // Send registration code
    public function sendRegisterCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $code = rand(100000, 999999);
        Cache::put('register_code_' . $request->email, $code, 600);
        Mail::raw("Votre code de confirmation FooTiX est : $code", function($msg) use ($request) {
            $msg->to($request->email)->subject('Code de confirmation FooTiX');
        });
        return response()->json(['message' => 'Code envoyé']);
    }

    // Verify registration code
    public function verifyRegisterCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required'
        ]);
        $cachedCode = Cache::get('register_code_' . $request->email);
        if ($cachedCode && strval($request->code) === strval($cachedCode)) {
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'message' => 'Code incorrect'], 400);
        }
    }
}
