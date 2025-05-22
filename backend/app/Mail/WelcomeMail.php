<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $customMessage;

    public function __construct($user, $customMessage)
    {
        $this->user = $user;
        $this->customMessage = $customMessage;
    }

    public function build()
    {
        return $this->subject('Bienvenue sur FooTiX')
            ->view('emails.welcome')
            ->with([
                'user' => $this->user,
                'customMessage' => $this->customMessage,
            ]);
    }
}
