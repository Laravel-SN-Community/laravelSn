<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\EventRegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EventRegistration>
 */
final class EventRegistrationFactory extends Factory
{
    protected $model = EventRegistration::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id' => User::factory(),
            'status' => EventRegistrationStatus::Pending,
            'notes' => null,
            'registered_at' => now(),
            'confirmed_at' => null,
            'cancelled_at' => null,
            'attended_at' => null,
        ];
    }
}
