<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Reaction;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reaction>
 */
final class ReactionFactory extends Factory
{
    protected $model = Reaction::class;

    public const TYPES = ['like', 'heart', 'fire', 'clap', 'rocket'];

    public function definition(): array
    {
        return [
            'reactable_type' => Thread::class,
            'reactable_id' => Thread::factory(),
            'user_id' => User::factory(),
            'type' => fake()->randomElement(self::TYPES),
        ];
    }

    public function ofType(string $type): self
    {
        return $this->state(fn () => ['type' => $type]);
    }
}
