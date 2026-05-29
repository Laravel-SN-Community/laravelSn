<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EventFormat;
use App\Enums\EventRegistrationStatus;
use App\Enums\PublicationStatus;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Override;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property PublicationStatus $status
 * @property EventFormat $format
 * @property Carbon $starts_at
 * @property Carbon|null $ends_at
 * @property Carbon|null $registration_opens_at
 * @property Carbon|null $registration_closes_at
 * @property-read bool $registrations_open
 * @property-read int|null $available_seats
 * @property-read bool $is_full
 */
final class Event extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $guarded = [];

    protected $appends = ['registrations_open', 'available_seats', 'is_full', 'cover_url'];

    #[Override]
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'registration_opens_at' => 'datetime',
            'registration_closes_at' => 'datetime',
            'is_online' => 'boolean',
            'is_featured' => 'boolean',
            'is_sponsored' => 'boolean',
            'capacity' => 'integer',
            'waitlist_capacity' => 'integer',
            'format' => EventFormat::class,
            'status' => PublicationStatus::class,
            'agenda' => 'array',
            'seo_meta' => 'array',
        ];
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function speakers(): HasMany
    {
        return $this->hasMany(EventSpeaker::class)->orderBy('order');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function confirmedRegistrations(): HasMany
    {
        return $this->registrations()->where('status', EventRegistrationStatus::Confirmed);
    }

    //    public function sponsors(): BelongsToMany
    //    {
    //        return $this->belongsToMany(Sponsor::class, 'event_sponsors')
    //            ->withPivot('tier_for_event');
    //    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', PublicationStatus::Published);
    }

    #[Scope]
    protected function upcoming(Builder $query): void
    {
        $query->where('starts_at', '>', now())->orderBy('starts_at');
    }

    #[Scope]
    protected function past(Builder $query): void
    {
        $query->where('ends_at', '<', now())->orderByDesc('starts_at');
    }

    #[Scope]
    protected function featured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    protected function isUpcoming(): Attribute
    {
        return Attribute::get(fn (): bool => $this->starts_at->isFuture());
    }

    protected function isPast(): Attribute
    {
        return Attribute::get(fn (): bool => $this->ends_at?->isPast() ?? $this->starts_at->isPast());
    }

    protected function isOngoing(): Attribute
    {
        return Attribute::get(
            fn (): bool => $this->starts_at->isPast() && ($this->ends_at?->isFuture() ?? true)
        );
    }

    protected function registrationsOpen(): Attribute
    {
        return Attribute::get(function (): bool {
            if ($this->registration_opens_at && $this->registration_opens_at->isFuture()) {
                return false;
            }

            if ($this->registration_closes_at && $this->registration_closes_at->isPast()) {
                return false;
            }

            return $this->starts_at->isFuture();
        });
    }

    protected function availableSeats(): Attribute
    {
        return Attribute::get(function (): ?int {
            if ($this->capacity === null) {
                return null;
            }

            $confirmed = $this->confirmedRegistrations()->count();

            return max(0, $this->capacity - $confirmed);
        });
    }

    protected function isFull(): Attribute
    {
        return Attribute::get(
            fn (): bool => $this->capacity !== null && $this->available_seats === 0
        );
    }

    protected function url(): Attribute
    {
        return Attribute::get(fn (): string => route('events.show', $this->slug));
    }

    protected function coverUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            $media = $this->getFirstMedia('cover');

            if (! $media instanceof Media) {
                return null;
            }

            if ($media->hasGeneratedConversion('webp')) {
                return $media->getUrl('webp');
            }

            return $media->getUrl();
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')
            ->singleFile()
            ->acceptsMimeTypes([
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/avif',
            ]);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->performOnCollections('cover')
            ->format('webp')
            ->quality(85);
    }

    #[Override]
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
