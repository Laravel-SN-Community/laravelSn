<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\EventRegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventSpeaker;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;

final class EventSeeder extends Seeder
{
    public function run(): void
    {
        $venues = Venue::all();
        $allUsers = User::all();

        $upcomingEvents = Event::factory()
            ->upcoming()
            ->count(5)
            ->recycle($venues)
            ->create();

        Event::factory()
            ->upcoming()
            ->featured()
            ->recycle($venues)
            ->create();

        $pastEvents = Event::factory()
            ->past()
            ->count(15)
            ->recycle($venues)
            ->create();

        $upcomingEvents->merge($pastEvents)->each(function (Event $event) use ($allUsers): void {
            EventSpeaker::factory()
                ->count(random_int(1, 3))
                ->for($event)
                ->create(['user_id' => $allUsers->random()->id]);
        });

        $upcomingEvents->each(function (Event $event) use ($allUsers): void {
            $max = min($event->capacity ?? 50, $allUsers->count());
            $count = random_int(min(3, $max), $max);
            $registrants = $allUsers->random($count);

            foreach ($registrants as $user) {
                EventRegistration::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'status' => EventRegistrationStatus::Confirmed,
                    'registered_at' => fake()->dateTimeBetween('-30 days', 'now'),
                    'confirmed_at' => fake()->dateTimeBetween('-30 days', 'now'),
                ]);
            }
        });

        $pastEvents->each(function (Event $event) use ($allUsers): void {
            $max = min($event->capacity ?? 80, $allUsers->count());
            $count = random_int(min(3, $max), $max);
            $registrants = $allUsers->random($count);

            foreach ($registrants as $user) {
                $attended = fake()->boolean(70);

                EventRegistration::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'status' => $attended ? EventRegistrationStatus::Attended : EventRegistrationStatus::NoShow,
                    'registered_at' => $event->starts_at->subDays(random_int(1, 30)),
                    'confirmed_at' => $event->starts_at->subDays(random_int(1, 30)),
                    'attended_at' => $attended ? $event->starts_at : null,
                ]);
            }
        });
    }
}
