<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

final class ResetPasswordNotification extends ResetPassword
{
    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Laravel.sn — Réinitialisation de votre mot de passe')
            ->view('mail.reset-password', [
                'userName' => $notifiable->name,
                'resetUrl' => $this->resetUrl($notifiable),
                'expireMinutes' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire'),
            ]);
    }
}
