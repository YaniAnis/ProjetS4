<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $request->name,
                    ],
                    'unit_amount' => $request->amount * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url('/success'),
            'cancel_url' => url('/cancel'),
        ]);

        return response()->json(['id' => $session->id]);
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'paiement_id' => 'required|exists:paiements,id',
            'verification_code' => 'required|string',
        ]);

        $paiement = \App\Models\Paiement::find($request->paiement_id);

        if ($paiement->verification_code === $request->verification_code) {
            $paiement->statut = 'validé';
            $paiement->save();
            return response()->json(['success' => true, 'message' => 'Payment verified.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid verification code.'], 422);
        }
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'card_number' => 'required|string',
            // ...other validations...
        ]);

        // Example: List of valid card numbers (for demo/testing)
        $validCardNumbers = [
            '4242424242424242',
            '4000056655665556',
            '5555555555554444',
   
        ];

        // Remove spaces from card number
        $cardNumber = str_replace(' ', '', $request->card_number);

        if (!in_array($cardNumber, $validCardNumbers)) {
            return response()->json(['success' => false, 'message' => 'Carte bancaire inconnue ou invalide.'], 422);
        }

        // ...create paiement, generate verification_code, save to DB...

        // Example:
        $verificationCode = rand(100000, 999999);
        $paiement = \App\Models\Paiement::create([
            // ...other fields...
            'verification_code' => $verificationCode,
            // ...
        ]);


        return response()->json([
            'success' => true,
            'paiement_id' => $paiement->id,
            'verification_code' => $verificationCode, // In real app, send by email/SMS
        ]);
    }
}

