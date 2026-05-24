<?php

declare(strict_types=1);

namespace App\Actions\Forum;

use App\Models\Channel;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class CreateThread
{
    /**
     * @param  array<int, int>  $channelIds
     */
    public function __invoke(User $author, string $title, string $body, array $channelIds): Thread
    {
        return DB::transaction(function () use ($author, $title, $body, $channelIds): Thread {
            $thread = Thread::create([
                'user_id' => $author->id,
                'title' => $title,
                'body' => $body,
                'last_posted_at' => now(),
            ]);

            $thread->channels()->sync($channelIds);

            Channel::whereIn('id', $channelIds)->increment('threads_count');

            $thread->subscribers()->attach($author->id);

            return $thread->fresh(['author', 'channels']);
        });
    }
}
