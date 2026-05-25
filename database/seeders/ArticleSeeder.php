<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $tags = Tag::all();

        $authors = User::factory(5)->asUser()->create();

        Article::factory()
            ->count(20)
            ->recycle($authors)
            ->create()
            ->each(function (Article $article) use ($tags): void {
                $article->tags()->attach($tags->random(rand(1, 3))->pluck('id'));

                if (rand(0, 1)) {
                    $article
                        ->addMediaFromUrl("https://picsum.photos/seed/{$article->slug}/1200/630")
                        ->toMediaCollection('media');
                }
            });

        Article::factory()
            ->draft()
            ->count(5)
            ->recycle($authors)
            ->create()
            ->each(function (Article $article) use ($tags): void {
                $article->tags()->attach($tags->random(rand(1, 2))->pluck('id'));
            });
    }
}
