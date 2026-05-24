<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Channel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Channel>
 */
final class ChannelFactory extends Factory
{
    protected $model = Channel::class;

    private const COLORS = ['#0F7B4D', '#F59E0B', '#FF2D20', '#9553E9', '#6366F1', '#0891B2', '#10B981', '#8B5CF6', '#EC4899', '#FBBF24'];

    private const ICONS = ['message-circle', 'help-circle', 'database', 'layout', 'server', 'cloud', 'check-circle', 'package', 'briefcase', 'sparkles'];

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(fake()->numberBetween(1, 3), true),
            'description' => fake()->sentence(),
            'color' => fake()->randomElement(self::COLORS),
            'icon' => fake()->randomElement(self::ICONS),
            'order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }

    public function inactive(): self
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function withParent(Channel $parent): self
    {
        return $this->state(fn () => ['parent_id' => $parent->id]);
    }
}
