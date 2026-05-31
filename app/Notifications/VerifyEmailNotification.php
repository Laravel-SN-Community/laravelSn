<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

final class VerifyEmailNotification extends VerifyEmail
{
    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Laravel.sn — Vérification de votre adresse email')
            ->view('mail.verify-email', [
                'userName' => $notifiable->name,
                'verifyUrl' => $this->verificationUrl($notifiable),
            ]);
    }
}
