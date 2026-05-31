<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Channel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

final class ChannelSeeder extends Seeder
{
    public function run(): void
    {
        $channels = [
            ['name' => 'Général', 'description' => 'Discussions générales autour de Laravel et de la communauté sénégalaise.', 'color' => '#0F7B4D', 'icon' => 'message-circle'],
            ['name' => 'Aide & Questions', 'description' => 'Besoin d\'aide ? Pose ta question ici.', 'color' => '#F59E0B', 'icon' => 'help-circle'],
            ['name' => 'Eloquent & Base de données', 'description' => 'Tout ce qui touche à Eloquent, requêtes, migrations, performance DB.', 'color' => '#FF2D20', 'icon' => 'database'],
            ['name' => 'Frontend', 'description' => 'Inertia, Livewire, React, Vue, Tailwind, Blade.', 'color' => '#9553E9', 'icon' => 'layout'],
            ['name' => 'API & Backend', 'description' => 'Sanctum, Passport, API REST, GraphQL, services backend.', 'color' => '#6366F1', 'icon' => 'server'],
            ['name' => 'DevOps & Déploiement', 'description' => 'Forge, Vapor, Docker, CI/CD, hébergement, monitoring.', 'color' => '#0891B2', 'icon' => 'cloud'],
            ['name' => 'Tests', 'description' => 'Pest, PHPUnit, TDD, tests E2E, intégration continue.', 'color' => '#10B981', 'icon' => 'check-circle'],
            ['name' => 'Packages', 'description' => 'Recommandations, retours d\'expérience, packages communautaires.', 'color' => '#8B5CF6', 'icon' => 'package'],
            ['name' => 'Carrière & Emploi', 'description' => 'Offres d\'emploi, conseils carrière, freelance, stages.', 'color' => '#EC4899', 'icon' => 'briefcase'],
            ['name' => 'Show & Tell', 'description' => 'Montre ce sur quoi tu travailles, partage tes projets.', 'color' => '#FBBF24', 'icon' => 'sparkles'],
        ];

        foreach ($channels as $order => $data) {
            Channel::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'color' => $data['color'],
                    'icon' => $data['icon'],
                    'order' => $order,
                    'is_active' => true,
                ],
            );
        }
    }
}
