<?php

declare(strict_types=1);

namespace App\Support\Exceptions;

use Exception;

final class ForumException extends Exception
{
    public static function threadLocked(): self
    {
        return new self('Cette discussion est verrouillée. Les nouvelles réponses ne sont plus acceptées.');
    }

    public static function replyNotInThread(): self
    {
        return new self('Cette réponse n\'appartient pas à cette discussion.');
    }

    public static function cannotMarkSolution(): self
    {
        return new self('Seul l\'auteur de la discussion peut marquer une réponse comme solution.');
    }

    public static function cannotEditReply(): self
    {
        return new self('Vous ne pouvez modifier que vos propres réponses.');
    }

    public static function channelCannotBeNestedDeeper(): self
    {
        return new self('Un sous-canal ne peut pas lui-même avoir des sous-canaux.');
    }
}
