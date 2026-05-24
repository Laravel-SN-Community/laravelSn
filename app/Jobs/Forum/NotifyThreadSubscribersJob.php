<?php

declare(strict_types=1);

namespace App\Jobs\Forum;

use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use App\Notifications\Forum\NewReplyNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

final class NotifyThreadSubscribersJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Thread $thread,
        public readonly Reply $reply,
        public readonly User $author,
    ) {}

    public function handle(): void
    {
        $this->thread->subscribers()
            ->where('users.id', '!=', $this->author->id)
            ->chunkById(100, function (Collection $subscribers): void {
                Notification::send($subscribers, new NewReplyNotification($this->thread, $this->reply, $this->author));
            });
    }
}
