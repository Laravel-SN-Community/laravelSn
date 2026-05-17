<?php

declare(strict_types=1);

namespace App\Support\Exceptions;

use Exception;

final class EventRegistrationException extends Exception
{
    public static function eventNotPublished(): self
    {
        return new self('Cet événement n\'est pas encore publié.');
    }

    public static function registrationsClosed(): self
    {
        return new self('Les inscriptions sont fermées pour cet événement.');
    }

    public static function alreadyRegistered(): self
    {
        return new self('Vous êtes déjà inscrit à cet événement.');
    }

    public static function waitlistFull(): self
    {
        return new self('La liste d\'attente est complète.');
    }

    public static function eventInPast(): self
    {
        return new self('Impossible de s\'inscrire à un événement passé.');
    }
}
