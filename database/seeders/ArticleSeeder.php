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

        $authors = User::factory(5)->create();
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser) {
            $authors->push($testUser);
        }

        Article::factory()
            ->count(20)
            ->recycle($authors)
            ->create()
            ->each(function (Article $article) use ($tags): void {
                $article->tags()->attach($tags->random(rand(1, 3))->pluck('id'));
            });

        // Drafts for the test user
        if ($testUser) {
            Article::factory()
                ->draft()
                ->count(3)
                ->for($testUser, 'author')
                ->create()
                ->each(function (Article $article) use ($tags): void {
                    $article->tags()->attach($tags->random(rand(1, 2))->pluck('id'));
                });
        }
    }
}
