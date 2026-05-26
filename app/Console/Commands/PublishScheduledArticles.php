<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\PublicationStatus;
use App\Models\Article;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('articles:publish-scheduled')]
#[Description('Publishes approved articles that have reached their scheduled publication date')]
final class PublishScheduledArticles extends Command
{
    public function handle(): int
    {
        $articles = Article::query()
            ->where('status', PublicationStatus::Approved)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->get();

        if ($articles->isEmpty()) {
            $this->info('No scheduled articles to publish.');

            return self::SUCCESS;
        }

        foreach ($articles as $article) {
            $article->withoutTimestamps(fn () => $article->update([
                'status' => PublicationStatus::Published,
            ]));

            // TODO: dispatch ArticlePublished event for notifications, search indexing, etc.

            $this->line("Published: [{$article->id}] {$article->title}");
        }

        $this->info("Published {$articles->count()} article(s).");

        return self::SUCCESS;
    }
}
