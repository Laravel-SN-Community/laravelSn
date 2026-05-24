<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Thread>
 */
final class ThreadFactory extends Factory
{
    protected $model = Thread::class;

    private const TITLES = [
        'Comment optimiser ses requêtes Eloquent ?',
        'Erreur 500 sur mon déploiement Forge',
        'Inertia v3 : shared data et TypeScript',
        'Pest : tester un job avec une queue fake',
        'Authentification multi-guard avec Sanctum',
        'Eloquent : différence entre with() et load()',
        'Docker + Laravel : configuration minimale',
        'Comment gérer les fichiers uploadés en prod ?',
        'Bonnes pratiques pour les Form Requests',
        'Horizon ne traite plus mes jobs, que faire ?',
        'Rate limiting sur une API publique',
        'Migrations : rollback sans perdre de données',
    ];

    public function definition(): array
    {
        $title = fake()->randomElement(self::TITLES).' '.fake()->numberBetween(1, 99);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'body' => implode("\n\n", fake()->paragraphs(fake()->numberBetween(2, 5))),
            'is_locked' => false,
            'is_pinned' => false,
            'replies_count' => 0,
            'views_count' => fake()->numberBetween(0, 1000),
            'last_posted_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function locked(): self
    {
        return $this->state(fn () => ['is_locked' => true]);
    }

    public function pinned(): self
    {
        return $this->state(fn () => ['is_pinned' => true]);
    }

    public function resolved(): self
    {
        return $this->state(fn (array $attributes) => [
            'resolved_by' => $attributes['user_id'] ?? User::factory(),
            'resolved_at' => now(),
        ]);
    }
}
