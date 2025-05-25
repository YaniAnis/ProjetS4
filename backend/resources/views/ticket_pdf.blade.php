<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ticket FooTiX - Match de Football</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            color: #222; 
            line-height: 1.4; 
            margin: 0;
            padding: 20px;
        }
        .ticket-container { 
            border: 1px solid #1a472a; 
            padding: 20px; 
            max-width: 600px; 
            margin: 0 auto; 
        }
        .header { 
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #1a472a;
            padding-bottom: 10px;
        }
        .title { 
            color: #1a472a; 
            font-size: 20px; 
            font-weight: bold; 
            margin-bottom: 5px; 
        }
        .match-details {
            background: #f8f9fa;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
        }
        .teams {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }
        .team {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .team-logo {
            width: 40px;  /* Augmenté la taille */
            height: 40px; /* Augmenté la taille */
            object-fit: contain;
            max-width: 100%;
            max-height: 100%;
        }
        .vs {
            margin: 0 10px;
            color: #1a472a;
        }
        .info-grid {
            margin: 20px 0;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .label {
            font-weight: bold;
            color: #1a472a;
            display: inline-block;
            min-width: 120px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="header">
            <div class="title">BILLET OFFICIEL FooTiX</div>
            <div>N° <?php echo e($ticket->id); ?></div>
        </div>

        <div class="match-details">
            <div class="teams">
                <div class="team">
                    <?php if (!empty($logos['home'])): ?>
                    <img src="<?php echo $logos['home']; ?>" alt="Logo <?php echo e($match->equipe1); ?>" class="team-logo" width="40" height="40">
                    <?php endif; ?>
                    <span><?php echo e($match->equipe1); ?></span>
                </div>
                <span class="vs">VS</span>
                <div class="team">
                    <?php if (!empty($logos['away'])): ?>
                    <img src="<?php echo $logos['away']; ?>" alt="Logo <?php echo e($match->equipe2); ?>" class="team-logo" width="40" height="40">
                    <?php endif; ?>
                    <span><?php echo e($match->equipe2); ?></span>
                </div>
            </div>
            <div><?php echo e($match->league); ?></div>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <span class="label">Date du match:</span>
                <span class="value"><?php echo e($match->date); ?></span>
            </div>
            <div class="info-item">
                <span class="label">Heure:</span>
                <span class="value"><?php echo e($match->heure); ?></span>
            </div>
            <div class="info-item">
                <span class="label">Stade:</span>
                <span class="value"><?php echo e($match->stade->nom ?? '-'); ?></span>
            </div>
            <div class="info-item">
                <span class="label">Zone:</span>
                <span class="value"><?php echo e($ticket->numero_place); ?></span>
            </div>
            <div class="info-item">
                <span class="label">Prix:</span>
                <span class="value"><?php echo e(number_format($ticket->prix, 2, ',', ' ')); ?> DZD</span>
            </div>
            <div class="info-item">
                <span class="label">Acheteur:</span>
                <span class="value"><?php echo e($ticket->user->name ?? '-'); ?></span>
            </div>
            <div class="info-item">
                <span class="label">Place de parking:</span>
                <span class="value"><?php echo e($ticket->parking === 'oui' ? 'Oui' : 'Non'); ?></span>
            </div>
        </div>

        <div class="footer">
            <p>Ticket généré le <?php echo e($paiement->created_at->format('d/m/Y à H:i')); ?></p>
            <p>Ce billet est personnel et ne peut être revendu. Présentez ce ticket et une pièce d'identité à l'entrée du stade.</p>
            <p>FooTiX - Votre billetterie officielle de football</p>
        </div>
    </div>
</body>
</html>
