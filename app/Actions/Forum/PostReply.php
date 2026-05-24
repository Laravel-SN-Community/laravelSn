<?php

declare(strict_types=1);

namespace App\Actions\Forum;

use App\Jobs\Forum\NotifyThreadSubscribersJob;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use App\Support\Exceptions\ForumException;
use Illuminate\Support\Facades\DB;

final readonly class PostReply
{
    public function __invoke(
        Thread $thread,
        User $author,
        string $body,
        ?Reply $parent = null,
    ): Reply {
        if ($thread->is_locked) {
            throw ForumException::threadLocked();
        }

        $reply = DB::transaction(function () use ($thread, $author, $body, $parent): Reply {
            $reply = Reply::create([
                'thread_id' => $thread->id,
                'user_id' => $author->id,
                'parent_id' => $parent?->id,
                'body' => $body,
            ]);

            $thread->increment('replies_count');
            $thread->update(['last_posted_at' => now()]);

            $thread->subscribers()->syncWithoutDetaching([$author->id]);

            return $reply->fresh(['author']);
        });

        NotifyThreadSubscribersJob::dispatch($thread, $reply, $author);

        return $reply;
    }
}
