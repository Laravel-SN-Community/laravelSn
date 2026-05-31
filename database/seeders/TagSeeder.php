<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

final class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'Eloquent',
            'Inertia',
            'Livewire',
            'Queues',
            'Tests',
            'Deploy',
            'Filament',
            'Sanctum',
            'Octane',
            'Horizon',
            'Pest',
            'Tailwind',
            'React',
            'TypeScript',
            'API',
            'Performance',
            'Sécurité',
            'DevOps',
            'Architecture',
            'PHP',
        ];

        foreach ($tags as $name) {
            Tag::firstOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => null,
                ],
            );
        }
    }
}
