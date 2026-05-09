<?php

declare(strict_types=1);

use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Tag;
use App\Models\User;

// ── index ──────────────────────────────────────────────────────────────────

test('guests can view the articles index', function () {
    Article::factory()->count(3)->create();

    $this->get(route('articles'))->assertOk();
});

test('articles index only shows published articles', function () {
    Article::factory()->create();
    Article::factory()->draft()->create();

    $this->get(route('articles'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('articles/index')
            ->where('articles.total', 1)
        );
});

test('articles index filters by tag', function () {
    $tag = Tag::factory()->create();
    $tagged = Article::factory()->create();
    $tagged->tags()->attach($tag);
    Article::factory()->create();

    $this->get(route('articles', ['tag' => $tag->slug]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('articles.total', 1));
});

test('articles index filters by locale', function () {
    Article::factory()->create(['locale' => 'fr']);
    Article::factory()->inEnglish()->create();

    $this->get(route('articles', ['locale' => 'en']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('articles.total', 1));
});

test('articles index searches by title', function () {
    Article::factory()->create(['title' => 'Unique findable title']);
    Article::factory()->create(['title' => 'Something else entirely']);

    $this->get(route('articles', ['q' => 'findable']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('articles.total', 1));
});

// ── show ───────────────────────────────────────────────────────────────────

test('guests can view a published article', function () {
    $article = Article::factory()->create();

    $this->get(route('article', $article))->assertOk();
});

test('guests get 404 for a draft article', function () {
    $article = Article::factory()->draft()->create();

    $this->get(route('article', $article))->assertNotFound();
});

test('author can preview their own draft article', function () {
    $author = User::factory()->create();
    $draft = Article::factory()->draft()->for($author, 'author')->create();

    $this->actingAs($author)
        ->get(route('article', $draft))
        ->assertOk();
});

test('other users cannot view a draft article', function () {
    $draft = Article::factory()->draft()->create();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('article', $draft))
        ->assertNotFound();
});

// ── dashboardIndex ─────────────────────────────────────────────────────────

test('guests are redirected from the articles dashboard', function () {
    $this->get(route('dashboard.articles'))->assertRedirect(route('login'));
});

test('authenticated users can view their articles dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard.articles'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard/articles'));
});

test('articles dashboard only shows the authenticated user\'s articles', function () {
    $user = User::factory()->create();
    $own = Article::factory()->for($user, 'author')->create();
    Article::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard.articles'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('publishedArticles.0.id', $own->id)
            ->count('publishedArticles', 1)
        );
});

// ── store ──────────────────────────────────────────────────────────────────

test('guests cannot create articles', function () {
    $this->post(route('articles.store'))->assertRedirect(route('login'));
});

test('authenticated users can create a draft article', function () {
    $user = User::factory()->create();
    $tag = Tag::factory()->create();

    $this->actingAs($user)->post(route('articles.store'), [
        'title' => 'Mon article de test',
        'body' => str_repeat('word ', 100),
        'locale' => 'fr',
        'tags' => [$tag->id],
        'is_draft' => true,
    ])->assertRedirect(route('dashboard.articles'));

    $this->assertDatabaseHas('articles', [
        'title' => 'Mon article de test',
        'status' => PublicationStatus::Draft->value,
        'author_id' => $user->id,
    ]);
});

test('authenticated users can submit an article for review', function () {
    $user = User::factory()->create();
    $tag = Tag::factory()->create();

    $this->actingAs($user)->post(route('articles.store'), [
        'title' => 'Article soumis',
        'body' => str_repeat('word ', 100),
        'locale' => 'fr',
        'tags' => [$tag->id],
        'is_draft' => false,
    ])->assertRedirect(route('dashboard.articles'));

    $this->assertDatabaseHas('articles', [
        'title' => 'Article soumis',
        'status' => PublicationStatus::Pending->value,
        'author_id' => $user->id,
    ]);
});

test('store validates required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('articles.store'), [])
        ->assertSessionHasErrors(['title', 'body', 'locale', 'tags']);
});
