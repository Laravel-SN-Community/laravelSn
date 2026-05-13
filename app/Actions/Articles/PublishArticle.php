<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Enums\PublicationStatus;
use App\Models\Article;
use Carbon\CarbonImmutable;

final readonly class PublishArticle
{
    public function __invoke(Article $article, ?CarbonImmutable $at = null): Article
    {
        $article->update([
            'status' => PublicationStatus::Published,
            'published_at' => $at ?? now(),
        ]);

        return $article->refresh();
    }
}
