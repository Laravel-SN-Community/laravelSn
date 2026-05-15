<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EventRegistrationStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property EventRegistrationStatus $status
 * @property Carbon $registered_at
 * @property Carbon|null $confirmed_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $attended_at
 */
final class EventRegistration extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['status_label'];

    protected function casts(): array
    {
        return [
            'status' => EventRegistrationStatus::class,
            'registered_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'attended_at' => 'datetime',
        ];
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::get(fn (): string => $this->status->label());
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function confirm(): void
    {
        $this->update([
            'status' => EventRegistrationStatus::Confirmed,
            'confirmed_at' => now(),
        ]);
    }

    public function cancel(): void
    {
        $this->update([
            'status' => EventRegistrationStatus::Cancelled,
            'cancelled_at' => now(),
        ]);
    }

    public function markAttended(): void
    {
        $this->update([
            'status' => EventRegistrationStatus::Attended,
            'attended_at' => now(),
        ]);
    }
}
