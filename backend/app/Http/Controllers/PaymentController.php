<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Mail;

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
        try {
            $request->validate([
                'paiement_id' => 'required|exists:paiements,id',
                'verification_code' => 'required|string',
            ]);

            $paiement = \App\Models\Paiement::find($request->paiement_id);

            if ($paiement && strval($paiement->verification_code) === strval($request->verification_code)) {
                $paiement->statut = 'validé';
                $paiement->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement confirmé !',
                ]);
            } else {
                \Log::warning('Code de vérification invalide', [
                    'envoyé' => $request->verification_code,
                    'attendu' => $paiement ? $paiement->verification_code : null,
                    'paiement_id' => $paiement ? $paiement->id : null
                ]);
                return response()->json(['success' => false, 'message' => 'Code de vérification invalide.'], 422);
            }
        } catch (\Throwable $e) {
            \Log::error('Erreur technique verifyPayment', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur technique lors de la vérification : ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendTicketByEmail(Request $request)
    {
        $request->validate([
            'paiement_id' => 'required|exists:paiements,id',
            'qr_value' => 'required|string',
        ]);

        $paiement = \App\Models\Paiement::find($request->paiement_id);

        if (!$paiement || empty($paiement->email)) {
            \Log::error('Email manquant sur le paiement', [
                'paiement_id' => $request->paiement_id,
                'paiement' => $paiement,
            ]);
            return response()->json([
                'success' => false,
                'message' => "Aucune adresse email n'est associée à ce paiement."
            ], 422);
        } 
        try {
            $qrValue = $request->qr_value;
            $tmpPng = tempnam(sys_get_temp_dir(), 'qr_') . '.png';

            try {
                $qr = new \Endroid\QrCode\QrCode($qrValue);
                $qr->setSize(300);
                $qr->writeFile($tmpPng);
            } catch (\Throwable $e) {
                \Log::error('Erreur génération QR code', ['error' => $e->getMessage()]);
                $tmpPng = null;
            }

            Mail::send([], [], function ($message) use ($paiement, $tmpPng, $qrValue) {
                $body = "Merci pour votre achat ! Voici votre QR code à présenter le jour du match.<br><br><img src='cid:qrcodeimg' /><br><br>Valeur brute : $qrValue";
                $message->to($paiement->email)
                    ->subject('Votre billet FooTiX - QR Code')
                    ->setBody($body, 'text/html');
                if ($tmpPng && file_exists($tmpPng)) {
                    $message->attach($tmpPng, [
                        'as' => 'qrcode_ticket.png',
                        'mime' => 'image/png',
                    ]);
                }
            });

            if ($tmpPng && file_exists($tmpPng)) {
                @unlink($tmpPng);
            }

            return response()->json([
                'success' => true,
                'message' => 'Le ticket a été envoyé par email.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur envoi mail QR code', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de l'envoi du ticket : " . $e->getMessage()
            ], 500);
        }
    }

    public function createPayment(Request $request)
    {
        \Log::info('createPayment called', ['data' => $request->all()]);

        $request->validate([
            'card_number' => 'required|string',
            'email' => 'required|email',
            // ...other validations...
        ]);

        if (!$request->email) {
            \Log::error('Email manquant dans la requête paiement');
            return response()->json([
                'success' => false,
                'message' => "L'email est obligatoire pour recevoir le code de confirmation."
            ], 422);
        }

        // Example: List of valid card numbers (for demo/testing)
        $validCardNumbers = [
            '4242424242424242',
            '4000056655665556',
            '5555555555554444',
        ];

        $cardNumber = str_replace(' ', '', $request->card_number);

        if (!in_array($cardNumber, $validCardNumbers)) {
            \Log::warning('Carte bancaire inconnue ou invalide', ['card_number' => $cardNumber]);
            return response()->json(['success' => false, 'message' => 'Carte bancaire inconnue ou invalide.'], 422);
        }

        // Générer le code de vérification à 6 chiffres
        $verificationCode = rand(100000, 999999);

        // Générer le ticket automatiquement (adaptez les champs selon votre modèle Ticket)
        try {
            $ticket = \App\Models\Ticket::create([
                // Remplissez ici les champs obligatoires de votre table tickets
                'user_id' => auth()->id() ?? 1, // ou autre logique pour lier l'utilisateur
                'match_id' => 1, // à adapter
                'prix' => 89.99, // à adapter
                'statut' => null, // <-- Ajoutez cette ligne pour satisfaire la contrainte SQL
                'numero_place' => 'A1', // <-- Ajoutez une valeur par défaut ou générez dynamiquement
                // ...autres champs requis...
            ]);
            $ticket_id = $ticket->id;
        } catch (\Exception $e) {
            \Log::error('Erreur création ticket', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de la création du ticket : " . $e->getMessage()
            ], 500);
        }

        // Créer le paiement en base
        try {
            $paiement = \App\Models\Paiement::create([
                'ticket_id' => $ticket_id,
                'user_id' => auth()->id() ?? 1,
                'mode_paiement' => 'carte', // <-- Ajoutez cette ligne pour satisfaire la contrainte SQL
                // ...autres champs requis...
                'verification_code' => $verificationCode,
                'email' => $request->email,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur création paiement', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de la création du paiement : " . $e->getMessage()
            ], 500);
        }

        \Log::info('Paiement créé', ['paiement_id' => $paiement->id, 'email' => $request->email]);

        // ENVOI DU MAIL DE CODE DE CONFIRMATION
        try {
            \Log::info('Tentative envoi mail paiement', [
                'to' => $request->email,
                'code' => $verificationCode,
            ]);
            Mail::raw(
                "Votre code de confirmation de paiement est : $verificationCode",
                function($msg) use ($request) {
                    $msg->to($request->email)->subject('Code de confirmation de paiement');
                }
            );
            \Log::info('Mail envoyé paiement');
        } catch (\Exception $e) {
            \Log::error('Erreur envoi mail paiement', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de l'envoi du mail : " . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'success' => true,
            'paiement_id' => $paiement->id,
        ]);
    }
}

