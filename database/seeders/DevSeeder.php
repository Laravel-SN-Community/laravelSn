<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

final class DevSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(DatabaseSeeder::class);

        User::factory()->moderator()->createMany([
            ['name' => 'Aïssatou Diop', 'username' => 'aissatou', 'email' => 'aissatou@laravel.sn'],
            ['name' => 'Omar Sy', 'username' => 'omarsy', 'email' => 'omar@laravel.sn'],
            ['name' => 'Mamadou Fall', 'username' => 'mamadou', 'email' => 'mamadou@laravel.sn'],
        ]);

        User::factory()->asUser()->count(20)->create();

        $this->call([
            ArticleSeeder::class,
            EventSeeder::class,
            ThreadSeeder::class,
        ]);
    }
}
