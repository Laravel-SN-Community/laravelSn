<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Enums\PublicationStatus;
use App\Models\Article;

final readonly class DeclineArticle
{
    public function __invoke(Article $article): Article
    {
        $article->update([
            'status' => PublicationStatus::Declined,
            'declined_at' => now(),
        ]);

        return $article->refresh();
    }
}
