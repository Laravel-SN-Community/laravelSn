<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Venue>
 */
final class VenueFactory extends Factory
{
    protected $model = Venue::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $venues = [
            ['name' => 'CTIC Dakar', 'district' => 'Plateau', 'lat' => 14.6720, 'lng' => -17.4319],
            ['name' => 'Jokkolabs Dakar', 'district' => 'Mermoz', 'lat' => 14.7167, 'lng' => -17.4677],
            ['name' => 'Impact Hub Dakar', 'district' => 'Plateau', 'lat' => 14.6692, 'lng' => -17.4441],
            ['name' => 'King Fahd Palace', 'district' => 'Almadies', 'lat' => 14.7440, 'lng' => -17.5090],
            ['name' => 'Radisson Blu Dakar', 'district' => 'Corniche Ouest', 'lat' => 14.6797, 'lng' => -17.4619],
            ['name' => 'Pullman Dakar', 'district' => 'Plateau', 'lat' => 14.6712, 'lng' => -17.4441],
            ['name' => 'CESAG', 'district' => 'Liberté 6', 'lat' => 14.7047, 'lng' => -17.4663],
        ];

        $venue = fake()->randomElement($venues);

        return [
            'name' => $venue['name'],
            'slug' => Str::slug($venue['name']).'-'.fake()->unique()->numberBetween(1, 999),
            'address' => fake()->streetAddress(),
            'district' => $venue['district'],
            'latitude' => $venue['lat'],
            'longitude' => $venue['lng'],
            'default_capacity' => fake()->randomElement([30, 50, 80, 100, 150, 200, 300]),
            'contact_email' => fake()->companyEmail(),
            'contact_phone' => '+221 33 '.fake()->numerify('### ## ##'),
            'access_notes' => fake()->boolean(60) ? 'Parking disponible. Accessible PMR.' : null,
        ];
    }
}
