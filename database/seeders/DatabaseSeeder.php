<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        // Admin
        User::factory()->admin()->create([
            'name' => 'Admin Laravel SN',
            'username' => 'admin',
            'email' => 'admin@laravel.sn',
        ]);

        // Moderators
        User::factory()->moderator()->createMany([
            ['name' => 'Aïssatou Diop', 'username' => 'aissatou', 'email' => 'aissatou@laravel.sn'],
            ['name' => 'Omar Sy', 'username' => 'omarsy', 'email' => 'omar@laravel.sn'],
            ['name' => 'Mamadou Fall', 'username' => 'mamadou', 'email' => 'mamadou@laravel.sn'],
        ]);

        // Regular users
        User::factory()->asUser()->count(20)->create();

        $this->call([
            TagSeeder::class,
            ArticleSeeder::class,
            VenueSeeder::class,
            EventSeeder::class,
            ChannelSeeder::class,
            ThreadSeeder::class,
        ]);
    }
}
