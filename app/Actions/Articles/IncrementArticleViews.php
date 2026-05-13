<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Models\Article;
use Illuminate\Support\Facades\Cache;

final readonly class IncrementArticleViews
{
    /**
     * Incrémente les vues d'un article avec rate limiting par IP.
     * Une même IP ne compte qu'une vue par article par 24h.
     */
    public function __invoke(Article $article, string $ipAddress): void
    {
        $cacheKey = sprintf('article-view:%d:%s', $article->id, sha1($ipAddress));

        if (Cache::has($cacheKey)) {
            return;
        }

        Cache::put($cacheKey, true, now()->addHours(24));

        $article->increment('views_count');
    }
}
