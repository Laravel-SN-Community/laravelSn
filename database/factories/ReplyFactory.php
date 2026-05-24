<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reply>
 */
final class ReplyFactory extends Factory
{
    protected $model = Reply::class;

    public function definition(): array
    {
        return [
            'thread_id' => Thread::factory(),
            'user_id' => User::factory(),
            'parent_id' => null,
            'body' => implode("\n\n", fake()->paragraphs(fake()->numberBetween(1, 3))),
            'is_edited' => false,
        ];
    }

    public function edited(): self
    {
        return $this->state(fn () => [
            'is_edited' => true,
            'edited_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function asChildOf(Reply $parent): self
    {
        return $this->state(fn () => [
            'thread_id' => $parent->thread_id,
            'parent_id' => $parent->id,
        ]);
    }
}
