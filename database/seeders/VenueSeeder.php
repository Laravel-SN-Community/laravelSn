<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

final class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = [
            [
                'name' => 'CTIC Dakar',
                'address' => 'Immeuble Fahd Ben Abdul Aziz, Avenue Cheikh Anta Diop',
                'district' => 'Plateau',
                'lat' => 14.6720, 'lng' => -17.4319,
                'capacity' => 80,
            ],
            [
                'name' => 'Jokkolabs Dakar',
                'address' => 'Mermoz Pyrotechnie, Villa 23',
                'district' => 'Mermoz',
                'lat' => 14.7167, 'lng' => -17.4677,
                'capacity' => 50,
            ],
            [
                'name' => 'Impact Hub Dakar',
                'address' => '1 Rue Robert Brun',
                'district' => 'Plateau',
                'lat' => 14.6692, 'lng' => -17.4441,
                'capacity' => 100,
            ],
            [
                'name' => 'King Fahd Palace',
                'address' => 'Route des Almadies',
                'district' => 'Almadies',
                'lat' => 14.7440, 'lng' => -17.5090,
                'capacity' => 500,
            ],
            [
                'name' => 'CESAG',
                'address' => 'Boulevard du Général de Gaulle',
                'district' => 'Liberté 6',
                'lat' => 14.7047, 'lng' => -17.4663,
                'capacity' => 200,
            ],
            [
                'name' => 'Orange Digital Center',
                'address' => 'Rue Aimé Césaire',
                'district' => 'Fann',
                'lat' => 14.6885, 'lng' => -17.4675,
                'capacity' => 150,
            ],
        ];

        foreach ($venues as $v) {
            Venue::create([
                'name' => $v['name'],
                'slug' => Str::slug($v['name']),
                'address' => $v['address'],
                'district' => $v['district'],
                'latitude' => $v['lat'],
                'longitude' => $v['lng'],
                'default_capacity' => $v['capacity'],
            ]);
        }
    }
}
