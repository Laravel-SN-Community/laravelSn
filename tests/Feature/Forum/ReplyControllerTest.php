<?php

declare(strict_types=1);

use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;

describe('Reply store', function (): void {
    it('requires authentication', function (): void {
        $thread = Thread::factory()->create();

        $this->post(route('forum.replies.store', $thread), [
            'body' => 'Voici ma réponse détaillée à ta question.',
        ])->assertRedirect(route('login'));
    });

    it('creates a reply on a thread', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.replies.store', $thread), [
                'body' => 'Voici ma réponse détaillée à ta question.',
            ])
            ->assertRedirect();

        expect(Reply::where('thread_id', $thread->id)->where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('creates a nested reply with parent', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();
        $parent = Reply::factory()->for($thread)->create();

        $this->actingAs($user)
            ->post(route('forum.replies.store', $thread), [
                'body' => 'Voici ma réponse détaillée à ta question.',
                'parent_id' => $parent->id,
            ]);

        expect(Reply::where('parent_id', $parent->id)->exists())->toBeTrue();
    });

    it('increments thread replies_count', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create(['replies_count' => 0]);

        $this->actingAs($user)->post(route('forum.replies.store', $thread), [
            'body' => 'Voici ma réponse détaillée à ta question.',
        ]);

        expect($thread->fresh()->replies_count)->toBe(1);
    });

    it('auto-subscribes the replier', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)->post(route('forum.replies.store', $thread), [
            'body' => 'Voici ma réponse détaillée à ta question.',
        ]);

        expect($thread->subscribers()->where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('returns error on locked thread', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->locked()->create();

        $this->actingAs($user)
            ->post(route('forum.replies.store', $thread), [
                'body' => 'Voici ma réponse détaillée à ta question.',
            ])
            ->assertSessionHasErrors('body');
    });

    it('validates minimum body length', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.replies.store', $thread), ['body' => 'Court'])
            ->assertSessionHasErrors('body');
    });
});

describe('Reply update', function (): void {
    it('allows owner to update reply', function (): void {
        $user = User::factory()->create();
        $reply = Reply::factory()->for($user, 'author')->create();

        $this->actingAs($user)
            ->patch(route('forum.replies.update', $reply), [
                'body' => 'Voici ma réponse corrigée avec plus de détails.',
            ])
            ->assertRedirect();

        expect($reply->fresh()->body)->toBe('Voici ma réponse corrigée avec plus de détails.');
    });

    it('marks reply as edited', function (): void {
        $user = User::factory()->create();
        $reply = Reply::factory()->for($user, 'author')->create();

        $this->actingAs($user)->patch(route('forum.replies.update', $reply), [
            'body' => 'Voici ma réponse corrigée avec plus de détails.',
        ]);

        expect($reply->fresh()->is_edited)->toBeTrue();
        expect($reply->fresh()->edited_at)->not->toBeNull();
    });

    it('denies non-owner from updating', function (): void {
        $other = User::factory()->create();
        $reply = Reply::factory()->create();

        $this->actingAs($other)
            ->patch(route('forum.replies.update', $reply), [
                'body' => 'Voici ma réponse corrigée avec plus de détails.',
            ])
            ->assertForbidden();
    });
});

describe('Reply destroy', function (): void {
    it('allows owner to delete reply', function (): void {
        $user = User::factory()->create();
        $reply = Reply::factory()->for($user, 'author')->create();

        $this->actingAs($user)
            ->delete(route('forum.replies.destroy', $reply))
            ->assertRedirect();

        expect($reply->fresh()->trashed())->toBeTrue();
    });

    it('denies admin from deleting someone else reply', function (): void {
        $admin = User::factory()->admin()->create();
        $reply = Reply::factory()->create();

        $this->actingAs($admin)
            ->delete(route('forum.replies.destroy', $reply))
            ->assertForbidden();
    });

    it('denies other users from deleting', function (): void {
        $other = User::factory()->create();
        $reply = Reply::factory()->create();

        $this->actingAs($other)
            ->delete(route('forum.replies.destroy', $reply))
            ->assertForbidden();
    });

    it('decrements thread replies_count', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create(['replies_count' => 1]);
        $reply = Reply::factory()->for($thread)->for($user, 'author')->create();

        $this->actingAs($user)->delete(route('forum.replies.destroy', $reply));

        expect($thread->fresh()->replies_count)->toBe(0);
    });
});
