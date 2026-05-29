<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

final class Venue extends Model
{
    use HasFactory;

    protected $guarded = [];

    #[Override]
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'default_capacity' => 'integer',
        ];
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    protected function fullAddress(): Attribute
    {
        return Attribute::get(fn (): string => trim(implode(', ', array_filter([
            $this->address,
            $this->district,
        ]))));
    }

    protected function googleMapsUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            if ($this->latitude === null || $this->longitude === null) {
                return null;
            }

            return sprintf(
                'https://www.google.com/maps/search/?api=1&query=%s,%s',
                $this->latitude,
                $this->longitude
            );
        });
    }
}
