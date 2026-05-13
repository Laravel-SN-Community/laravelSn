<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Models\Article;

final readonly class DeleteArticle
{
    public function __invoke(Article $article): void
    {
        $article->delete();
    }
}
