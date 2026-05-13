<?php

declare(strict_types=1);

namespace App\Actions\Articles;

use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class CreateArticle
{
    public function __construct(
        private CalculateReadingTime $calculateReadingTime,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, int>  $tagIds
     */
    public function __invoke(User $author, array $data, array $tagIds = []): Article
    {
        return DB::transaction(function () use ($author, $data, $tagIds): Article {
            $article = Article::create([
                'author_id' => $author->id,
                'title' => $data['title'],
                'body' => $data['body'],
                'locale' => $data['locale'] ?? 'fr',
                'status' => $data['status'] ?? PublicationStatus::Draft,
                'published_at' => $data['published_at'] ?? null,
                'reading_time_minutes' => ($this->calculateReadingTime)($data['body']),
                'is_featured' => $data['is_featured'] ?? false,
                'seo_meta' => $data['seo_meta'] ?? null,
            ]);

            if ($tagIds !== []) {
                $article->tags()->sync($tagIds);
            }

            return $article->fresh(['author', 'tags']);
        });
    }
}
