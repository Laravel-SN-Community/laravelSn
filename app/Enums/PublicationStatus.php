<?php

declare(strict_types=1);

namespace App\Enums;

enum PublicationStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Published = 'published';
    case Declined = 'declined';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::Pending => 'En attente',
            self::Approved => 'Approuvé',
            self::Published => 'Publié',
            self::Declined => 'Refusé',
            self::Archived => 'Archivé',
        };
    }

    public function isVisible(): bool
    {
        return $this === self::Published;
    }
}
