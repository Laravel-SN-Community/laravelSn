<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            ChannelSeeder::class,
            TagSeeder::class,
            VenueSeeder::class,
        ]);

        User::firstOrCreate(
            ['email' => 'admin@laravel.sn'],
            [
                'name' => 'Laravel SN',
                'username' => 'admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        )->assignRole('admin');
    }
}
