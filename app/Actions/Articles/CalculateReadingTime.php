<?php

declare(strict_types=1);

namespace App\Actions\Articles;

final readonly class CalculateReadingTime
{
    private const WORDS_PER_MINUTE = 200;

    public function __invoke(string $body): int
    {
        $plainText = strip_tags($body);
        $wordCount = str_word_count($plainText);

        return max(1, (int) ceil($wordCount / self::WORDS_PER_MINUTE));
    }
}
