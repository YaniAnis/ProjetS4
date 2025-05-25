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

                $ticket = \App\Models\Ticket::with(['user', 'match.stade'])->find($paiement->ticket_id);
                $match = $ticket->match;

                // Handle parking if selected
                if ($ticket->parking === 'oui' && $match->parking_places > 0) {
                    $match->parking_places -= 1;
                    $match->save();
                }

                // --- Correction parking : détection et décrémentation ---
                // On récupère le ticket et on vérifie si la colonne parking est bien renseignée
                // Si le champ est absent ou "non", on tente de le corriger à partir du paiement (si possible)
                if ($ticket->parking !== 'oui') {
                    // On tente de retrouver l'info parking dans le paiement ou dans la requête (si transmise)
                    $hasParking = false;
                    // Si le ticket a un champ parking, on le garde, sinon on regarde dans le paiement ou la requête
                    if ($request->has('additionalOptions')) {
                        $additionalOptions = $request->input('additionalOptions', []);
                        if (is_array($additionalOptions)) {
                            $hasParking = isset($additionalOptions['parking']) && $additionalOptions['parking'];
                        } elseif (is_object($additionalOptions)) {
                            $hasParking = isset($additionalOptions->parking) && $additionalOptions->parking;
                        }
                    }
                    // Si on a détecté parking, on met à jour le ticket
                    if ($hasParking) {
                        $ticket->parking = 'oui';
                        $ticket->save();
                    }
                }

                // Décrémentation parking_places si le ticket a parking = 'oui'
                if ($ticket->parking === 'oui' && $match->parking_places > 0) {
                    $match->parking_places -= 1;
                    $match->save();
                }

                // Get team logos
                $logos = [
                    'home' => $this->getTeamLogoPath($match->equipe1),
                    'away' => $this->getTeamLogoPath($match->equipe2),
                ];

                // Generate PDF with logos
                $pdf = Pdf::loadView('ticket_pdf', [
                    'paiement' => $paiement,
                    'ticket' => $ticket,
                    'match' => $match,
                    'logos' => $logos, // Pass logos to the PDF view
                ]);
                $pdfContent = $pdf->output();

                Mail::send([], [], function (Message $message) use ($userEmail, $pdfContent) {
                    $message->to($userEmail)
                        ->subject('Votre billet FooTiX - PDF')
                        ->html("Merci pour votre achat !<br>Vous trouverez en pièce jointe votre ticket au format PDF. Présentez-le le jour du match.")
                        ->attachData($pdfContent, 'ticket_footiX.pdf', [
                            'mime' => 'application/pdf',
                    ]);
                });

                return response()->json([
                    'success' => true,
                    'message' => 'Paiement confirmé ! Le ticket PDF a été envoyé par email.',
                ]);
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
            $ticket = \App\Models\Ticket::with('user')->find($paiement->ticket_id);
            Log::info('Ticket trouvé', ['ticket' => $ticket]);

            if (!$ticket || !$ticket->user) {
                return response()->json([
                    'success' => false,
                    'message' => "Utilisateur introuvable pour ce ticket."
                ], 422);
            }

            $userEmail = $ticket->user->email;
            $match = Matches::find($ticket->match_id);

            // Get team logos
            $logos = [
                'home' => $this->getTeamLogoPath($match->equipe1),
                'away' => $this->getTeamLogoPath($match->equipe2),
            ];

            // Generate PDF with logos
            $pdf = Pdf::loadView('ticket_pdf', [
                'paiement' => $paiement,
                'ticket' => $ticket->load('user'),
                'match' => $match->load('stade'),
                'qrValue' => $request->qr_value,
                'logos' => $logos, // Pass logos to the PDF view
            ]);
            $pdfContent = $pdf->output();

            Mail::send([], [], function (Message $message) use ($userEmail, $pdfContent) {
                $message->to($userEmail)
                    ->subject('Votre billet FooTiX - PDF')
                    ->html("Merci pour votre achat !<br>Vous trouverez en pièce jointe votre ticket au format PDF. Présentez-le le jour du match.")
                    ->attachData($pdfContent, 'ticket_footiX.pdf', [
                        'mime' => 'application/pdf',
                    ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Le ticket PDF a été envoyé par email.',
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
        try {
            Log::info('createPayment called', ['data' => $request->all()]);

            $request->validate([
                'card_number' => 'required|string',
                'name' => 'required|string',
                'expiry' => 'required|string',
                'cvc' => 'required|string',
                'selectedZones' => 'required|array',
                'selectedZones.*.id' => 'required',
                'selectedZones.*.name' => 'required',
                'selectedZones.*.count' => 'required|integer',
                'selectedZones.*.price' => 'required|numeric',
                'totalPlaces' => 'required|numeric',
                'totalPrice' => 'required|numeric',
                'match_id' => 'required|exists:matches,id',
                'additionalOptions' => 'nullable|array',
            ]);

            $user = \Illuminate\Support\Facades\Auth::user();
            if (!$user || !$user->email) {
                throw new \Exception('Utilisateur non connecté ou sans email');
            }

            // Validate card number
            $validCardNumbers = ['4242424242424242', '4000056655665556', '5555555555554444'];
            $cardNumber = str_replace(' ', '', $request->card_number);
            if (!in_array($cardNumber, $validCardNumbers)) {
                throw new \Exception('Carte bancaire invalide');
            }

            // Utilise le match_id envoyé par le front
            $match_id = $request->match_id;

            // Correction ici : bien récupérer l'option parking (supporte array ou object)
            $additionalOptions = $request->input('additionalOptions', []);
            $hasParking = false;
            if (is_array($additionalOptions)) {
                $hasParking = isset($additionalOptions['parking']) && $additionalOptions['parking'];
            } elseif (is_object($additionalOptions)) {
                $hasParking = isset($additionalOptions->parking) && $additionalOptions->parking;
            }

            $parkingPrice = $hasParking ? 500 : 0;
            $totalPrice = $request->totalPrice + $parkingPrice;

            // Décrémenter parking_places si parking sélectionné
            if ($hasParking) {
                $match = \App\Models\Matches::find($request->match_id);
                if ($match && $match->parking_places > 0) {
                    $match->parking_places -= 1;
                    $match->save();
                } else {
                    throw new \Exception('Plus de places de parking disponibles.');
                }
            }

            // --- Décrémenter les places disponibles pour chaque zone sélectionnée ---
            foreach ($request->selectedZones as $zone) {
                // Recherche par match_id + name si l'id n'est pas numérique
                if (is_numeric($zone['id'])) {
                    $zoneModel = \App\Models\Zone::find($zone['id']);
                } else {
                    $zoneModel = \App\Models\Zone::where('match_id', $match_id)
                        ->where('name', $zone['name'])
                        ->first();
                }
                if (!$zoneModel) {
                    throw new \Exception("Zone non trouvée (ID: {$zone['id']}, Nom: {$zone['name']})");
                }
                if ($zoneModel->places < $zone['count']) {
                    throw new \Exception("Pas assez de places disponibles pour la zone {$zoneModel->name}");
                }
                $zoneModel->places -= $zone['count'];
                $zoneModel->save();
            }
            // --- Fin décrémentation ---

            // Correction ici : renseigner le champ parking du ticket
            $ticket = \App\Models\Ticket::create([
                'user_id' => $user->id,
                'match_id' => $request->match_id,
                'prix' => $totalPrice,
                'statut' => 'pending',
                'numero_place' => implode(',', array_map(fn($z) => "{$z['name']}({$z['count']})", $request->selectedZones)),
                'parking' => $hasParking ? 'oui' : 'non', // <-- Correction ici
            ]);

            $verificationCode = rand(100000, 999999);
            $paiement = \App\Models\Paiement::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'mode_paiement' => 'carte',
                'verification_code' => $verificationCode,
                'email' => $user->email,
                'montant' => $request->totalPrice,
                'statut' => 'pending'
            ]);

            // Send verification email
            Mail::raw(
                "Votre code de confirmation de paiement est : $verificationCode",
                function($msg) use ($user) {
                    $msg->to($user->email)
                       ->subject('Code de confirmation de paiement');
                }
            );

            return response()->json([
                'success' => true,
                'paiement_id' => $paiement->id,
                'message' => 'Code de vérification envoyé'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur createPayment', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // AJOUTE OU VÉRIFIE BIEN CETTE MÉTHODE
    public function index()
    {
        // Retourne tous les paiements avec relations ticket et user, et ajoute le nombre de billets achetés
        $paiements = \App\Models\Paiement::with(['ticket', 'user'])->get();

        $paiements = $paiements->map(function($paiement) {
            // Si le ticket a un champ nb_places, on l'utilise, sinon on compte 1
            $nb_places = 1;
            if ($paiement->ticket && isset($paiement->ticket->nb_places)) {
                $nb_places = $paiement->ticket->nb_places;
            } elseif ($paiement->ticket && isset($paiement->ticket->numero_place)) {
                // Si numero_place est une chaîne comme "Zone A(2),Zone B(1)", on additionne les quantités
                $matches = [];
                preg_match_all('/\((\d+)\)/', $paiement->ticket->numero_place, $matches);
                if (!empty($matches[1])) {
                    $nb_places = array_sum(array_map('intval', $matches[1]));
                }
            }
            $paiement->nb_places = $nb_places;
            return $paiement;
        });

        return response()->json($paiements);
    }

    private function getTeamLogoPath($teamName) {
        try {
            $teamName = strtolower(str_replace(' ', '_', $teamName));
            $logoPath = public_path("logos/{$teamName}.png");
            
            // Check if the file exists
            if (!file_exists($logoPath)) {
                Log::warning('Logo not found', ['team' => $teamName, 'path' => $logoPath]);
                return '';
            }

            // Read the file content
            $imageContent = file_get_contents($logoPath);
            $imageInfo = getimagesize($logoPath);

            // Validate the image file
            if ($imageInfo === false) {
                Log::error('Invalid image file', ['path' => $logoPath]);
                return '';
            }

            $mime = $imageInfo['mime'];
            $base64 = base64_encode($imageContent);

            // Ensure the file is a supported image type
            if ($mime !== 'image/png' && $mime !== 'image/jpeg') {
                Log::error('Unsupported image mime type', ['mime' => $mime, 'path' => $logoPath]);
                return '';
            }

            return "data:{$mime};base64,{$base64}";
        } catch (\Exception $e) {
            Log::error('Error in getTeamLogoPath', [
                'team' => $teamName,
                'error' => $e->getMessage()
            ]);
            return '';
        }
    }
}

