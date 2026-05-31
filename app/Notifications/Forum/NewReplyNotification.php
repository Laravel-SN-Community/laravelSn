<?php

declare(strict_types=1);

namespace App\Notifications\Forum;

use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

final class NewReplyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Thread $thread,
        public readonly Reply $reply,
        public readonly User $author,
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
        $preview = Str::limit(strip_tags($this->reply->body), 150);
        $subject = "Nouvelle réponse : {$this->thread->title}";

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.new-reply', [
                'subject' => $subject,
                'userName' => $notifiable->name,
                'authorName' => $this->author->name,
                'threadTitle' => $this->thread->title,
                'preview' => $preview,
                'replyUrl' => $this->thread->url,
            ]);
    }
}
