<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ThreadSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $channels = Channel::all();

        Thread::factory()
            ->count(40)
            ->make()
            ->each(function (Thread $thread) use ($users, $channels): void {
                $thread->user_id = $users->random()->id;
                $thread->save();

                $threadChannels = $channels->random(random_int(1, 2));
                $thread->channels()->attach($threadChannels->pluck('id'));

                $threadChannels->each(fn (Channel $channel) => $channel->increment('threads_count'));

                $thread->subscribers()->attach($thread->user_id);

                $replyCount = random_int(0, 12);

                if ($replyCount === 0) {
                    return;
                }

                $replies = Reply::factory()
                    ->count($replyCount)
                    ->make()
                    ->each(function (Reply $reply) use ($thread, $users): void {
                        $reply->thread_id = $thread->id;
                        $reply->user_id = $users->random()->id;
                        $reply->save();

                        $thread->subscribers()->syncWithoutDetaching([$reply->user_id]);
                    });

                $thread->update([
                    'replies_count' => $replyCount,
                    'last_posted_at' => $replies->last()->created_at,
                ]);

                if (random_int(0, 3) === 0) {
                    $solution = $replies->random();
                    $thread->update([
                        'solution_reply_id' => $solution->id,
                        'resolved_by' => $thread->user_id,
                        'resolved_at' => now(),
                    ]);
                }
            });
    }
}
