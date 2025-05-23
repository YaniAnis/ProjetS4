<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Matches;
use Symfony\Component\Mime\Part\HtmlPart;
use Illuminate\Mail\Message;

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

                // Ensure the email is set
                $user = \App\Models\User::find($paiement->user_id);
                if (!$user || empty($user->email)) {
                    Log::error('Email is missing for the user', ['paiement_id' => $paiement->id, 'user_id' => $paiement->user_id]);
                    return response()->json([
                        'success' => false,
                        'message' => "Aucune adresse email n'est associée à cet utilisateur."
                    ], 422);
                }

                $paiement->email = $user->email;
                $paiement->save();

                // Envoi automatique du ticket PDF après validation du paiement
                try {
                    // Récupérer le ticket lié au paiement
                    $ticket = \App\Models\Ticket::find($paiement->ticket_id);

                    if (!$ticket) {
                        Log::error('Ticket introuvable pour le paiement', ['paiement_id' => $paiement->id]);
                        return response()->json([
                            'success' => false,
                            'message' => 'Paiement confirmé, mais le ticket associé est introuvable. Veuillez contacter le support.',
                        ], 500);
                    }

                    // Récupérer le match (Matches)
                    $match = Matches::find($ticket->match_id);
                    if (!$match) {
                        Log::error('Match introuvable pour le ticket', ['ticket_id' => $ticket->id, 'match_id' => $ticket->match_id]);
                        return response()->json([
                            'success' => false,
                            'message' => 'Paiement confirmé, mais le match associé au ticket est introuvable. Veuillez contacter le support.',
                        ], 500);
                    }

                    Log::info('Génération du PDF pour le paiement', ['paiement_id' => $paiement->id]);
                    try {
                        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('ticket_pdf', [
                            'paiement' => $paiement,
                            'ticket' => $ticket,
                            'match' => $match,
                        ]);

                        $pdfContent = $pdf->output();
                        Log::info('PDF rendu avec succès', ['paiement_id' => $paiement->id, 'pdf_size' => strlen($pdfContent)]);
                    } catch (\Exception $pdfEx) {
                        Log::error('Erreur lors du rendu du PDF', ['error' => $pdfEx->getMessage(), 'paiement_id' => $paiement->id]);
                        return response()->json([
                            'success' => false,
                            'message' => 'Paiement confirmé, mais une erreur est survenue lors de la génération du ticket PDF. Veuillez contacter le support.',
                        ], 500);
                    }

                    Log::info('Tentative d\'envoi du mail ticket PDF', ['to' => $paiement->email, 'paiement_id' => $paiement->id]);
                    try {
                        Mail::send([], [], function (Message $message) use ($paiement, $pdfContent) {
                            $message->to($paiement->email)
                                ->subject('Votre billet FooTiX - PDF')
                                ->html("Merci pour votre achat !<br>Vous trouverez en pièce jointe votre ticket au format PDF. Présentez-le le jour du match.")
                                ->attachData($pdfContent, 'ticket_footiX.pdf', [
                                    'mime' => 'application/pdf',
                                ]);
                        });
                        Log::info('Mail envoyé ticket PDF après validation paiement', ['to' => $paiement->email, 'paiement_id' => $paiement->id]);
                    } catch (\Exception $mailEx) {
                        Log::error('Erreur lors de l\'envoi du mail ticket PDF après validation paiement', ['error' => $mailEx->getMessage(), 'paiement_id' => $paiement->id]);
                        return response()->json([
                            'success' => false,
                            'message' => 'Paiement confirmé, mais une erreur est survenue lors de l\'envoi du ticket PDF. Veuillez contacter le support.',
                        ], 500);
                    }

                    return response()->json([
                        'success' => true,
                        'message' => 'Paiement confirmé ! Le ticket PDF a été envoyé par email.',
                    ]);
                } catch (\Exception $e) {
                    Log::error('Erreur lors de l\'envoi du mail', ['error' => $e->getMessage(), 'paiement_id' => $paiement->id]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Paiement confirmé, mais une erreur est survenue lors de l\'envoi du mail. Veuillez contacter le support.',
                    ], 500);
                }
            } else {
                Log::warning('Code de vérification invalide', [
                    'envoyé' => $request->verification_code,
                    'attendu' => $paiement ? $paiement->verification_code : null,
                    'paiement_id' => $paiement ? $paiement->id : null
                ]);
                return response()->json(['success' => false, 'message' => 'Code de vérification invalide.'], 422);
            }
        } catch (\Throwable $e) {
            Log::error('Erreur technique verifyPayment', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur technique lors de la vérification : ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendTicketByEmail(Request $request)
    {
        Log::info('sendTicketByEmail called', ['data' => $request->all()]);

        $request->validate([
            'paiement_id' => 'required|exists:paiements,id',
            'qr_value' => 'required|string',
        ]);

        $paiement = \App\Models\Paiement::find($request->paiement_id);

        if (!$paiement || empty($paiement->email)) {
            Log::error('Email manquant sur le paiement', [
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
            Log::info('Paiement trouvé', ['paiement' => $paiement]);

            // Récupérer le ticket lié au paiement
            $ticket = \App\Models\Ticket::find($paiement->ticket_id);
            Log::info('Ticket trouvé', ['ticket' => $ticket]);

            // Générer le PDF avec DomPDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('ticket_pdf', [
                'paiement' => $paiement,
                'ticket' => $ticket,
                'qrValue' => $qrValue,
            ]);
            $pdfContent = $pdf->output();
            Log::info('PDF généré');

            // Utiliser le mailer SMTP explicitement
            try {
                Log::info('Tentative envoi mail ticket PDF', ['to' => $paiement->email]);
                Mail::send([], [], function (Message $message) use ($paiement, $pdfContent) {
                    $message->to($paiement->email)
                        ->subject('Votre billet FooTiX - PDF')
                        ->html("Merci pour votre achat !<br>Vous trouverez en pièce jointe votre ticket au format PDF. Présentez-le le jour du match.")
                        ->attachData($pdfContent, 'ticket_footiX.pdf', [
                            'mime' => 'application/pdf',
                        ]);
                });
                Log::info('Mail envoyé ticket PDF', ['to' => $paiement->email]);
            } catch (\Exception $mailEx) {
                Log::error('Erreur lors de l\'envoi du mail ticket PDF', ['error' => $mailEx->getMessage()]);
                return response()->json([
                    'success' => false,
                    'message' => "Erreur lors de l'envoi du ticket PDF : " . $mailEx->getMessage()
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Le ticket PDF a été envoyé par email.'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur envoi mail PDF ticket', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de l'envoi du ticket PDF : " . $e->getMessage()
            ], 500);
        }
    }

    public function createPayment(Request $request)
    {
        Log::info('createPayment called', ['data' => $request->all()]);

        $request->validate([
            'card_number' => 'required|string',
            'email' => 'required|email',
            // ...other validations...
        ]);

        if (!$request->email) {
            Log::error('Email manquant dans la requête paiement');
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
            Log::warning('Carte bancaire inconnue ou invalide', ['card_number' => $cardNumber]);
            return response()->json(['success' => false, 'message' => 'Carte bancaire inconnue ou invalide.'], 422);
        }

        // Générer le code de vérification à 6 chiffres
        $verificationCode = rand(100000, 999999);

        // Générer le ticket automatiquement (adaptez les champs selon votre modèle Ticket)
        try {
            $ticket = \App\Models\Ticket::create([
                'user_id' => \Illuminate\Support\Facades\Auth::check() ? \Illuminate\Support\Facades\Auth::id() : 1, // ou autre logique pour lier l'utilisateur
                'match_id' => 1, // à adapter
                'prix' => 89.99, // à adapter
                'statut' => null, // <-- Ajoutez cette ligne pour satisfaire la contrainte SQL
                'numero_place' => 'A1', // <-- Ajoutez une valeur par défaut ou générez dynamiquement
                // ...autres champs requis...
            ]);
            $ticket_id = $ticket->id;
        } catch (\Exception $e) {
            Log::error('Erreur création ticket', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de la création du ticket : " . $e->getMessage()
            ], 500);
        }

        // Créer le paiement en base
        try {
            $paiement = \App\Models\Paiement::create([
                'ticket_id' => $ticket_id,
                'user_id' => optional(auth())->id() ?? 1,
                'mode_paiement' => 'carte', // <-- Ajoutez cette ligne pour satisfaire la contrainte SQL
                // ...autres champs requis...
                'verification_code' => $verificationCode,
                'email' => $request->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur création paiement', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Erreur lors de la création du paiement : " . $e->getMessage()
            ], 500);
        }

        Log::info('Paiement créé', ['paiement_id' => $paiement->id, 'email' => $request->email]);

        // ENVOI DU MAIL DE CODE DE CONFIRMATION
        try {
            Log::info('Tentative envoi mail paiement', [
                'to' => $request->email,
                'code' => $verificationCode,
            ]);
            Mail::send([], [], function (Message $message) use ($request, $verificationCode) {
                $message->to($request->email)
                    ->subject('Code de confirmation de paiement')
                    ->html("Votre code de confirmation de paiement est : {$verificationCode}");
            });
            Log::info('Mail envoyé paiement');
        } catch (\Exception $e) {
            Log::error('Erreur envoi mail paiement', ['error' => $e->getMessage()]);
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

