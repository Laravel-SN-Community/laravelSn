<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Enums\PublicationStatus;
use App\Models\Article;

final readonly class PublishArticle
{
    public function __invoke(Article $article): Article
    {
        $hasFutureDate = $article->published_at !== null && $article->published_at->isFuture();

        if ($hasFutureDate) {
            // Article has a scheduled future date — mark as approved, command will publish on the date.
            $article->update([
                'status' => PublicationStatus::Approved,
                'approved_at' => now(),
            ]);
        } else {
            // No future date — publish immediately.
            $article->update([
                'status' => PublicationStatus::Published,
                'published_at' => now(),
                'approved_at' => now(),
            ]);
        }

        return $article->refresh();
    }
}
