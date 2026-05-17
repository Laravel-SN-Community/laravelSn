<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Event;
use App\Models\EventSpeaker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EventSpeaker>
 */
final class EventSpeakerFactory extends Factory
{
    protected $model = EventSpeaker::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id' => null,
            'name' => fake()->name(),
            'role' => fake()->jobTitle(),
            'company' => fake()->company(),
            'bio' => fake()->paragraph(),
            'twitter_handle' => fake()->boolean(50) ? fake()->userName() : null,
            'linkedin_handle' => fake()->boolean(70) ? fake()->userName() : null,
            'talk_title' => fake()->sentence(6),
            'talk_description' => fake()->paragraph(),
            'order' => fake()->numberBetween(0, 10),
        ];
    }
}
