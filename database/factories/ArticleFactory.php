<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Article>
 */
final class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $titles = [
            'Modèles sans N+1 : patterns éprouvés',
            'Queues & Horizon en production',
            'Inertia v3 : les nouveautés',
            'Tester ses jobs avec Pest',
            "De Livewire à Inertia : retour d'expérience",
            'Filament 3 pour les SaaS',
            'Laravel Octane en pratique',
            'Eloquent : 10 astuces avancées',
            'Authentification Sanctum vs Passport',
            'Déployer Laravel sur Forge',
            'Building a REST API with Laravel',
            'Laravel queues: a practical guide',
            'Testing Laravel apps with Pest',
            'From zero to production with Laravel Cloud',
        ];

        $title = fake()->randomElement($titles).' '.fake()->numberBetween(1, 100);

        return [
            'author_id' => User::factory(),
            'title' => $title,
            'body' => $this->generateMarkdownBody(),
            'locale' => 'fr',
            'status' => PublicationStatus::Published,
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'reading_time_minutes' => fake()->numberBetween(3, 15),
            'views_count' => fake()->numberBetween(0, 5000),
            'likes_count' => fake()->numberBetween(0, 200),
            'is_featured' => fake()->boolean(15),
            'seo_meta' => null,
        ];
    }

    public function draft(): self
    {
        return $this->state(fn (): array => [
            'status' => PublicationStatus::Draft,
            'published_at' => null,
        ]);
    }

    public function featured(): self
    {
        return $this->state(fn (): array => ['is_featured' => true]);
    }

    public function inEnglish(): self
    {
        return $this->state(fn (): array => ['locale' => 'en']);
    }

    private function generateMarkdownBody(): string
    {
        $sections = [];

        for ($i = 0; $i < fake()->numberBetween(3, 6); $i++) {
            $sections[] = '## '.fake()->sentence(4);
            $sections[] = fake()->paragraphs(fake()->numberBetween(2, 4), true);

            if (fake()->boolean(40)) {
                $sections[] = "```php\n".$this->generateCodeSample()."\n```";
            }

            if (fake()->boolean(30)) {
                $sections[] = '> '.fake()->sentence(15);
            }
        }

        return implode("\n\n", $sections);
    }

    private function generateCodeSample(): string
    {
        $samples = [
            "use App\Models\User;\n\nUser::query()\n    ->whereActive(true)\n    ->orderByDesc('created_at')\n    ->paginate();",
            "Route::get('/articles', [ArticleController::class, 'index'])\n    ->name('articles.index');",
            "public function articles(): HasMany\n{\n    return \$this->hasMany(Article::class);\n}",
            "public function up(): void\n{\n    Schema::create('articles', function (Blueprint \$table) {\n        \$table->id();\n        \$table->string('title');\n        \$table->timestamps();\n    });\n}",
        ];

        return fake()->randomElement($samples);
    }
}
