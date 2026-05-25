<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Models\Article;
use Illuminate\Support\Facades\DB;

final readonly class UpdateArticle
{
    public function __construct(
        private CalculateReadingTime $calculateReadingTime,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, int>  $tagIds
     */
    public function __invoke(Article $article, array $data, array $tagIds = []): Article
    {
        return DB::transaction(function () use ($article, $data, $tagIds): Article {
            $article->update([
                'title' => $data['title'],
                'body' => $data['body'],
                'locale' => $data['locale'] ?? $article->locale,
                'status' => $data['status'] ?? $article->status,
                'published_at' => $data['published_at'] ?? $article->published_at,
                'submitted_at' => array_key_exists('submitted_at', $data) ? $data['submitted_at'] : $article->submitted_at,
                'reading_time_minutes' => ($this->calculateReadingTime)($data['body']),
            ]);

            if ($tagIds !== []) {
                $article->tags()->sync($tagIds);
            }

            return $article->fresh(['author', 'tags']);
        });
    }
}
