<?php

declare(strict_types=1);

use App\Models\Channel;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('Thread show', function () {
    it('renders forum/thread with thread and replies', function () {
        $thread = Thread::factory()->create();
        Reply::factory()->for($thread)->count(3)->create();

        $this->get(route('forum.threads.show', $thread))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('forum/thread')
                ->has('thread')
                ->has('replies.data', 3)
                ->has('isSubscribed')
            );
    });

    it('shows isSubscribed as false for guests', function () {
        $thread = Thread::factory()->create();

        $this->get(route('forum.threads.show', $thread))
            ->assertInertia(fn (Assert $page) => $page
                ->where('isSubscribed', false)
            );
    });

    it('shows isSubscribed as true for subscribed user', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();
        $thread->subscribers()->attach($user->id);

        $this->actingAs($user)
            ->get(route('forum.threads.show', $thread))
            ->assertInertia(fn (Assert $page) => $page
                ->where('isSubscribed', true)
            );
    });

    it('only returns top-level replies, not nested ones', function () {
        $thread = Thread::factory()->create();
        $parent = Reply::factory()->for($thread)->create();
        Reply::factory()->asChildOf($parent)->create();

        $this->get(route('forum.threads.show', $thread))
            ->assertInertia(fn (Assert $page) => $page
                ->has('replies.data', 1)
            );
    });
});

describe('Thread store', function () {
    it('requires authentication', function () {
        $channel = Channel::factory()->create();

        $this->post(route('forum.threads.store'), [
            'title' => 'Comment faire X avec Laravel ?',
            'body' => 'Je cherche à faire quelque chose de spécifique avec Laravel.',
            'channel_ids' => [$channel->id],
        ])->assertRedirect(route('login'));
    });

    it('creates a thread and attaches channels', function () {
        $user = User::factory()->create();
        $channel = Channel::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.threads.store'), [
                'title' => 'Comment faire X avec Laravel ?',
                'body' => 'Je cherche à faire quelque chose de spécifique avec Laravel.',
                'channel_ids' => [$channel->id],
            ])
            ->assertRedirect();

        $thread = Thread::first();

        expect($thread)->not->toBeNull();
        expect($thread->user_id)->toBe($user->id);
        expect($thread->channels)->toHaveCount(1);
    });

    it('auto-subscribes the author', function () {
        $user = User::factory()->create();
        $channel = Channel::factory()->create();

        $this->actingAs($user)->post(route('forum.threads.store'), [
            'title' => 'Comment faire X avec Laravel ?',
            'body' => 'Je cherche à faire quelque chose de spécifique avec Laravel.',
            'channel_ids' => [$channel->id],
        ]);

        $thread = Thread::first();

        expect($thread->subscribers()->where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('increments channel threads_count', function () {
        $user = User::factory()->create();
        $channel = Channel::factory()->create(['threads_count' => 0]);

        $this->actingAs($user)->post(route('forum.threads.store'), [
            'title' => 'Comment faire X avec Laravel ?',
            'body' => 'Je cherche à faire quelque chose de spécifique avec Laravel.',
            'channel_ids' => [$channel->id],
        ]);

        expect($channel->fresh()->threads_count)->toBe(1);
    });

    it('validates required fields', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.threads.store'), [])
            ->assertSessionHasErrors(['title', 'body', 'channel_ids']);
    });

    it('requires at least 10 characters in title', function () {
        $user = User::factory()->create();
        $channel = Channel::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.threads.store'), [
                'title' => 'Court',
                'body' => 'Trop court',
                'channel_ids' => [$channel->id],
            ])
            ->assertSessionHasErrors(['title', 'body']);
    });
});

describe('Thread markSolution', function () {
    it('allows thread owner to mark a reply as solution', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->for($user, 'author')->create();
        $reply = Reply::factory()->for($thread)->create();

        $this->actingAs($user)
            ->post(route('forum.threads.solution', [$thread, $reply]))
            ->assertRedirect();

        expect($thread->fresh()->solution_reply_id)->toBe($reply->id);
    });

    it('denies non-owner from marking solution', function () {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $thread = Thread::factory()->for($owner, 'author')->create();
        $reply = Reply::factory()->for($thread)->create();

        $this->actingAs($other)
            ->post(route('forum.threads.solution', [$thread, $reply]))
            ->assertForbidden();
    });

    it('returns error if reply does not belong to thread', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->for($user, 'author')->create();
        $otherThread = Thread::factory()->create();
        $replyFromOtherThread = Reply::factory()->for($otherThread)->create();

        $this->actingAs($user)
            ->post(route('forum.threads.solution', [$thread, $replyFromOtherThread]))
            ->assertSessionHasErrors('solution');
    });
});

describe('Thread subscribe / unsubscribe', function () {
    it('requires authentication', function () {
        $thread = Thread::factory()->create();

        $this->post(route('forum.threads.subscribe', $thread))
            ->assertRedirect(route('login'));
    });

    it('subscribes user to thread', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.threads.subscribe', $thread));

        expect($thread->subscribers()->where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('unsubscribes user from thread', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();
        $thread->subscribers()->attach($user->id);

        $this->actingAs($user)
            ->delete(route('forum.threads.unsubscribe', $thread));

        expect($thread->subscribers()->where('user_id', $user->id)->exists())->toBeFalse();
    });
});

describe('Thread lock', function () {
    it('allows admin to lock a thread', function () {
        $admin = User::factory()->admin()->create();
        $thread = Thread::factory()->create(['is_locked' => false]);

        $this->actingAs($admin)
            ->post(route('forum.threads.lock', $thread))
            ->assertRedirect();

        expect($thread->fresh()->is_locked)->toBeTrue();
    });

    it('allows moderator to lock a thread', function () {
        $mod = User::factory()->moderator()->create();
        $thread = Thread::factory()->create(['is_locked' => false]);

        $this->actingAs($mod)
            ->post(route('forum.threads.lock', $thread))
            ->assertRedirect();

        expect($thread->fresh()->is_locked)->toBeTrue();
    });

    it('denies regular user from locking a thread', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->create(['is_locked' => false]);

        $this->actingAs($user)
            ->post(route('forum.threads.lock', $thread))
            ->assertForbidden();
    });

    it('allows admin to unlock a thread', function () {
        $admin = User::factory()->admin()->create();
        $thread = Thread::factory()->create(['is_locked' => true]);

        $this->actingAs($admin)
            ->delete(route('forum.threads.unlock', $thread))
            ->assertRedirect();

        expect($thread->fresh()->is_locked)->toBeFalse();
    });

    it('allows moderator to unlock a thread', function () {
        $mod = User::factory()->moderator()->create();
        $thread = Thread::factory()->create(['is_locked' => true]);

        $this->actingAs($mod)
            ->delete(route('forum.threads.unlock', $thread))
            ->assertRedirect();

        expect($thread->fresh()->is_locked)->toBeFalse();
    });

    it('denies regular user from unlocking a thread', function () {
        $user = User::factory()->create();
        $thread = Thread::factory()->create(['is_locked' => true]);

        $this->actingAs($user)
            ->delete(route('forum.threads.unlock', $thread))
            ->assertForbidden();
    });
});
