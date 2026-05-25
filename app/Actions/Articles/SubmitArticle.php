<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Enums\PublicationStatus;
use App\Models\Article;

final readonly class SubmitArticle
{
    public function __invoke(Article $article): Article
    {
        $article->withoutTimestamps(fn () => $article->update([
            'status' => PublicationStatus::Pending,
            'submitted_at' => now(),
        ]));

        return $article->refresh();
    }
}
