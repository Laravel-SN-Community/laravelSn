<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\EventFormat;
use App\Enums\PublicationStatus;
use App\Models\Event;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
final class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [
            'Meetup Dakar — Filament & admin panels',
            'Workshop : tests Pest + CI GitHub Actions',
            'Laracon Sénégal — Conférence annuelle',
            'Atelier Inertia + React',
            'Meetup : Eloquent en profondeur',
            'Workshop déploiement avec Forge',
            'Soirée code review communautaire',
            'Hackathon Laravel + IA',
        ];

        $title = fake()->randomElement($titles).' #'.fake()->unique()->numberBetween(1, 999);
        $startsAt = fake()->dateTimeBetween('-3 months', '+3 months');
        $endsAt = (clone $startsAt)->modify('+'.fake()->numberBetween(2, 8).' hours');

        return [
            'venue_id' => Venue::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'format' => fake()->randomElement(EventFormat::cases())->value,
            'description' => fake()->paragraphs(2, true),
            'agenda' => $this->generateAgenda(),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'registration_opens_at' => (clone $startsAt)->modify('-30 days'),
            'registration_closes_at' => (clone $startsAt)->modify('-1 day'),
            'capacity' => fake()->randomElement([30, 50, 80, 100, 150, 300]),
            'waitlist_capacity' => fake()->numberBetween(0, 30),
            'is_online' => fake()->boolean(20),
            'online_url' => null,
            'status' => PublicationStatus::Published,
            'is_featured' => fake()->boolean(10),
        ];
    }

    public function upcoming(): self
    {
        return $this->state(function (): array {
            $startsAt = fake()->dateTimeBetween('+1 week', '+3 months');
            $endsAt = (clone $startsAt)->modify('+'.fake()->numberBetween(2, 8).' hours');

            return [
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'registration_opens_at' => now()->subDay(),
                'registration_closes_at' => (clone $startsAt)->modify('-1 day'),
            ];
        });
    }

    public function past(): self
    {
        return $this->state(function (): array {
            $startsAt = fake()->dateTimeBetween('-1 year', '-1 week');
            $endsAt = (clone $startsAt)->modify('+'.fake()->numberBetween(2, 8).' hours');

            return [
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
            ];
        });
    }

    public function featured(): self
    {
        return $this->state(fn () => ['is_featured' => true]);
    }

    public function online(): self
    {
        return $this->state(fn () => [
            'is_online' => true,
            'online_url' => fake()->url(),
            'venue_id' => null,
        ]);
    }

    /**
     * @return array<int, array{time: string, title: string}>
     */
    private function generateAgenda(): array
    {
        return [
            ['time' => '18h00', 'title' => 'Accueil et networking'],
            ['time' => '18h30', 'title' => "Mot d'introduction"],
            ['time' => '18h45', 'title' => 'Talk principal'],
            ['time' => '19h30', 'title' => 'Q&A'],
            ['time' => '20h00', 'title' => 'Cocktail networking'],
        ];
    }
}
