{{-- filepath: e:\_DOCUMENT\Documents\GitHub\ProjetS4\ProjetS4\backend\resources\views\ticket_pdf.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Votre Ticket FooTiX</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #222; }
        .ticket-container { border: 2px solid #1a472a; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
        .title { color: #1a472a; font-size: 28px; font-weight: bold; margin-bottom: 16px; }
        .info { margin-bottom: 8px; }
        .qr { text-align: center; margin-top: 24px; }
        .label { font-weight: bold; }
        .row { margin-bottom: 6px; }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="title">Votre billet FooTiX</div>
        <div class="row"><span class="label">Ticket ID :</span> <?php echo e($ticket ? $ticket->id : '-'); ?></div>
        <div class="row"><span class="label">Match ID :</span> <?php echo e($ticket ? $ticket->match_id : '-'); ?></div>
        <div class="row"><span class="label">Utilisateur ID :</span> <?php echo e($ticket ? $ticket->user_id : '-'); ?></div>
        <div class="row"><span class="label">Nom utilisateur :</span>
            <?php
                $userName = null;
                if ($ticket && $ticket->user_id) {
                    $user = \App\Models\User::find($ticket->user_id);
                    $userName = $user ? $user->name : '-';
                }
            ?>
            <?php echo e($userName ?? '-'); ?>

        </div>
        <div class="row"><span class="label">Prix :</span> <?php echo e($ticket ? number_format($ticket->prix, 2, ',', ' ') : '-'); ?> €</div>
        <div class="row"><span class="label">Numéro de place :</span> <?php echo e($ticket ? $ticket->numero_place : '-'); ?></div>
        <div class="row"><span class="label">Nom équipe 1 :</span> <?php echo e($match ? $match->equipe1 : '-'); ?></div>
        <div class="row"><span class="label">Nom équipe 2 :</span> <?php echo e($match ? $match->equipe2 : '-'); ?></div>
        <div class="row"><span class="label">Date d'achat :</span> <?php echo e($paiement->created_at ? $paiement->created_at->format('d/m/Y H:i') : '-'); ?></div>
        <div style="margin-top:18px; font-size:12px; color:#888;">
            Merci pour votre achat ! Présentez ce ticket à l'entrée du stade.
        </div>
    </div>
</body>
</html>
