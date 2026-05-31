<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class LegacyPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $plainPassword,
        public readonly string $provider,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Laravel.sn — Votre compte a été migré')
            ->view('mail.legacy-password', [
                'subject' => 'Laravel.sn — Votre compte a été migré',
                'userName' => $notifiable->name,
                'provider' => $this->provider,
                'plainPassword' => $this->plainPassword,
                'loginUrl' => url('/login'),
                'logoUrl' => asset('images/logo.svg'),
            ]);
    }
}
