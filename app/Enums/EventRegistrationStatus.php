<?php

declare(strict_types=1);

namespace App\Enums;

enum EventRegistrationStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Waitlisted = 'waitlisted';
    case Cancelled = 'cancelled';
    case Attended = 'attended';
    case NoShow = 'no_show';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::Confirmed => 'Confirmée',
            self::Waitlisted => 'Liste d\'attente',
            self::Cancelled => 'Annulée',
            self::Attended => 'Présent',
            self::NoShow => 'Absent',
        };
    }
}
