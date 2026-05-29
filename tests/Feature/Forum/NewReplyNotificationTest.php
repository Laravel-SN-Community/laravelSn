<?php

declare(strict_types=1);

use App\Jobs\Forum\NotifyThreadSubscribersJob;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use App\Notifications\Forum\NewReplyNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;

describe('NotifyThreadSubscribersJob dispatch', function (): void {
    it('dispatches the job when a reply is posted', function (): void {
        Queue::fake();

        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.replies.store', $thread), [
                'body' => 'Voici ma réponse détaillée à ta question.',
            ]);

        Queue::assertPushed(NotifyThreadSubscribersJob::class);
    });
});

describe('NotifyThreadSubscribersJob handle', function (): void {
    it('notifies thread subscribers', function (): void {
        Notification::fake();

        $subscriber = User::factory()->create();
        $author = User::factory()->create();
        $thread = Thread::factory()->create();
        $reply = Reply::factory()->for($thread)->for($author, 'author')->create();
        $thread->subscribers()->attach($subscriber->id);

        (new NotifyThreadSubscribersJob($thread, $reply, $author))->handle();

        Notification::assertSentTo($subscriber, NewReplyNotification::class);
    });

    it('does not notify the reply author', function (): void {
        Notification::fake();

        $author = User::factory()->create();
        $thread = Thread::factory()->create();
        $reply = Reply::factory()->for($thread)->for($author, 'author')->create();
        $thread->subscribers()->attach($author->id);

        (new NotifyThreadSubscribersJob($thread, $reply, $author))->handle();

        Notification::assertNotSentTo($author, NewReplyNotification::class);
    });

    it('does not notify when there are no other subscribers', function (): void {
        Notification::fake();

        $author = User::factory()->create();
        $thread = Thread::factory()->create();
        $reply = Reply::factory()->for($thread)->for($author, 'author')->create();

        (new NotifyThreadSubscribersJob($thread, $reply, $author))->handle();

        Notification::assertNothingSent();
    });

    it('notifies multiple subscribers', function (): void {
        Notification::fake();

        $subscribers = User::factory()->count(3)->create();
        $author = User::factory()->create();
        $thread = Thread::factory()->create();
        $reply = Reply::factory()->for($thread)->for($author, 'author')->create();
        $thread->subscribers()->attach($subscribers->pluck('id'));

        (new NotifyThreadSubscribersJob($thread, $reply, $author))->handle();

        Notification::assertSentTo($subscribers, NewReplyNotification::class);
    });

    it('sends notification with correct thread and author data', function (): void {
        Notification::fake();

        $subscriber = User::factory()->create();
        $author = User::factory()->create();
        $thread = Thread::factory()->create();
        $reply = Reply::factory()->for($thread)->for($author, 'author')->create();
        $thread->subscribers()->attach($subscriber->id);

        (new NotifyThreadSubscribersJob($thread, $reply, $author))->handle();

        Notification::assertSentTo(
            $subscriber,
            NewReplyNotification::class,
            fn (NewReplyNotification $notification): bool => $notification->thread->id === $thread->id
                && $notification->author->id === $author->id,
        );
    });
});
