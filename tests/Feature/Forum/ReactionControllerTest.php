<?php

declare(strict_types=1);

use App\Models\Reaction;
use App\Models\Thread;
use App\Models\User;
use Database\Factories\ReactionFactory;

describe('Reaction toggle', function (): void {
    it('requires authentication', function (): void {
        $thread = Thread::factory()->create();

        $this->post(route('forum.reactions.toggle', $thread), ['type' => 'like'])
            ->assertRedirect(route('login'));
    });

    it('adds a reaction when none exists', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.reactions.toggle', $thread), ['type' => 'like'])
            ->assertRedirect();

        expect(
            Reaction::where('reactable_type', Thread::class)
                ->where('reactable_id', $thread->id)
                ->where('user_id', $user->id)
                ->where('type', 'like')
                ->exists()
        )->toBeTrue();
    });

    it('removes a reaction when it already exists', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        Reaction::factory()->create([
            'reactable_type' => Thread::class,
            'reactable_id' => $thread->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $this->actingAs($user)
            ->post(route('forum.reactions.toggle', $thread), ['type' => 'like']);

        expect(
            Reaction::where('reactable_id', $thread->id)
                ->where('user_id', $user->id)
                ->where('type', 'like')
                ->exists()
        )->toBeFalse();
    });

    it('allows different reaction types on the same thread', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)->post(route('forum.reactions.toggle', $thread), ['type' => 'like']);
        $this->actingAs($user)->post(route('forum.reactions.toggle', $thread), ['type' => 'fire']);

        expect(
            Reaction::where('reactable_id', $thread->id)->where('user_id', $user->id)->count()
        )->toBe(2);
    });

    it('validates reaction type', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        $this->actingAs($user)
            ->post(route('forum.reactions.toggle', $thread), ['type' => 'invalid'])
            ->assertSessionHasErrors('type');
    });

    it('only accepts known reaction types', function (): void {
        $user = User::factory()->create();
        $thread = Thread::factory()->create();

        foreach (ReactionFactory::TYPES as $type) {
            $this->actingAs($user)
                ->post(route('forum.reactions.toggle', $thread), ['type' => $type])
                ->assertRedirect();
        }
    });
});
