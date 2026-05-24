<?php

declare(strict_types=1);

namespace App\Actions\Forum;

use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use App\Support\Exceptions\ForumException;

final readonly class MarkReplyAsSolution
{
    public function __invoke(Thread $thread, Reply $reply, User $resolver): Thread
    {
        if ($reply->thread_id !== $thread->id) {
            throw ForumException::replyNotInThread();
        }

        if ($resolver->id !== $thread->user_id && ! $resolver->isModerator()) {
            throw ForumException::cannotMarkSolution();
        }

        $thread->markAsResolved($reply, $resolver);

        return $thread->fresh();
    }
}
