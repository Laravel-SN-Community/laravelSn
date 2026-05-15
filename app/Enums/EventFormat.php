<?php

declare(strict_types=1);

namespace App\Enums;

enum EventFormat: string
{
    case Meetup = 'meetup';
    case Workshop = 'workshop';
    case Conference = 'conference';
    case Hackathon = 'hackathon';
    case Webinar = 'webinar';

    public function label(): string
    {
        return match ($this) {
            self::Meetup => 'Meetup',
            self::Workshop => 'Workshop',
            self::Conference => 'Conférence',
            self::Hackathon => 'Hackathon',
            self::Webinar => 'Webinaire',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::Meetup => 'users',
            self::Workshop => 'wrench',
            self::Conference => 'mic',
            self::Hackathon => 'code',
            self::Webinar => 'video',
        };
    }
}
