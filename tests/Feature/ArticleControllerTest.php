<?php

declare(strict_types=1);

use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Tag;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(fn () => $this->seed(RolesAndPermissionsSeeder::class));

// ── index ──────────────────────────────────────────────────────────────────

test('guests can view the articles index', function (): void {
    Article::factory()->count(3)->create();

    $this->get(route('articles'))->assertOk();
});

test('articles index only shows published articles', function (): void {
    Article::factory()->create();
    Article::factory()->draft()->create();

    $this->get(route('articles'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('articles/index')
            ->where('articles.total', 1)
        );
});

test('articles index filters by tag', function (): void {
    $tag = Tag::factory()->create();
    $tagged = Article::factory()->create();
    $tagged->tags()->attach($tag);
    Article::factory()->create();

    $this->get(route('articles', ['tag' => $tag->slug]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('articles.total', 1));
});

test('articles index filters by locale', function (): void {
    Article::factory()->create(['locale' => 'fr']);
    Article::factory()->inEnglish()->create();

    $this->get(route('articles', ['locale' => 'en']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('articles.total', 1));
});

test('articles index searches by title', function (): void {
    Article::factory()->create(['title' => 'Unique findable title']);
    Article::factory()->create(['title' => 'Something else entirely']);

    $this->get(route('articles', ['q' => 'findable']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('articles.total', 1));
});

// ── show ───────────────────────────────────────────────────────────────────

test('guests can view a published article', function (): void {
    $article = Article::factory()->create();

    $this->get(route('article', $article))->assertOk();
});

test('guests get 404 for a draft article', function (): void {
    $article = Article::factory()->draft()->create();

    $this->get(route('article', $article))->assertNotFound();
});

test('author can preview their own draft article', function (): void {
    $author = User::factory()->create();
    $draft = Article::factory()->draft()->for($author, 'author')->create();

    $this->actingAs($author)
        ->get(route('article', $draft))
        ->assertOk();
});

test('other users cannot view a draft article', function (): void {
    $draft = Article::factory()->draft()->create();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('article', $draft))
        ->assertNotFound();
});

// ── dashboardIndex ─────────────────────────────────────────────────────────

test('guests are redirected from the articles dashboard', function (): void {
    $this->get(route('dashboard.articles'))->assertRedirect(route('login'));
});

test('authenticated users can view their articles dashboard', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard.articles'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard/articles'));
});

test('articles dashboard only shows the authenticated user\'s articles', function (): void {
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

test('guests cannot create articles', function (): void {
    $this->post(route('articles.store'))->assertRedirect(route('login'));
});

test('authenticated users can create a draft article', function (): void {
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

test('authenticated users can submit an article for review', function (): void {
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

test('store validates required fields', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('articles.store'), [])
        ->assertSessionHasErrors(['title', 'body', 'locale', 'tags']);
});

// ── update ─────────────────────────────────────────────────────────────────

test('guests cannot update articles', function (): void {
    $article = Article::factory()->draft()->create();

    $this->patch(route('articles.update', $article))->assertRedirect(route('login'));
});

test('author can update their own draft article', function (): void {
    $user = User::factory()->create();
    $tag = Tag::factory()->create();
    $article = Article::factory()->draft()->for($user, 'author')->create();

    $this->actingAs($user)->patch(route('articles.update', $article), [
        'title' => 'Titre mis à jour',
        'body' => str_repeat('word ', 100),
        'locale' => 'fr',
        'tags' => [$tag->id],
        'is_draft' => true,
    ])->assertRedirect(route('dashboard.articles'));

    $this->assertDatabaseHas('articles', [
        'id' => $article->id,
        'title' => 'Titre mis à jour',
    ]);
});

test('other users cannot update an article', function (): void {
    $tag = Tag::factory()->create();
    $article = Article::factory()->draft()->create();
    $other = User::factory()->create();

    $this->actingAs($other)->patch(route('articles.update', $article), [
        'title' => 'Tentative de modification',
        'body' => str_repeat('word ', 100),
        'locale' => 'fr',
        'tags' => [$tag->id],
    ])->assertForbidden();
});

test('updating a published article keeps it published', function (): void {
    $user = User::factory()->create();
    $tag = Tag::factory()->create();
    $article = Article::factory()->for($user, 'author')->create();

    $this->actingAs($user)->patch(route('articles.update', $article), [
        'title' => 'Titre corrigé',
        'body' => str_repeat('word ', 100),
        'locale' => 'fr',
        'tags' => [$tag->id],
        'is_draft' => false,
    ])->assertRedirect(route('dashboard.articles'));

    $this->assertDatabaseHas('articles', [
        'id' => $article->id,
        'title' => 'Titre corrigé',
        'status' => PublicationStatus::Published->value,
    ]);
});

test('update validates required fields', function (): void {
    $user = User::factory()->create();
    $article = Article::factory()->draft()->for($user, 'author')->create();

    $this->actingAs($user)
        ->patch(route('articles.update', $article), [])
        ->assertSessionHasErrors(['title', 'body', 'locale', 'tags']);
});

// ── destroy ────────────────────────────────────────────────────────────────

test('guests cannot delete articles', function (): void {
    $article = Article::factory()->draft()->create();

    $this->delete(route('articles.destroy', $article))->assertRedirect(route('login'));
});

test('author can delete their own draft article', function (): void {
    $user = User::factory()->create();
    $article = Article::factory()->draft()->for($user, 'author')->create();

    $this->actingAs($user)
        ->delete(route('articles.destroy', $article))
        ->assertRedirect(route('dashboard.articles'));

    $this->assertSoftDeleted('articles', ['id' => $article->id]);
});

test('other users cannot delete an article', function (): void {
    $article = Article::factory()->draft()->create();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->delete(route('articles.destroy', $article))
        ->assertForbidden();
});

// ── publish ────────────────────────────────────────────────────────────────

test('guests cannot publish articles', function (): void {
    $article = Article::factory()->draft()->create();

    $this->post(route('manage.articles.publish', $article))->assertRedirect(route('login'));
});

test('moderator can publish a draft article', function (): void {
    $moderator = User::factory()->moderator()->create();
    $article = Article::factory()->draft()->create();

    $this->actingAs($moderator)
        ->post(route('manage.articles.publish', $article))
        ->assertRedirect(route('manage.articles.index'));

    $this->assertDatabaseHas('articles', [
        'id' => $article->id,
        'status' => PublicationStatus::Published->value,
    ]);
});

test('regular users cannot publish an article', function (): void {
    $article = Article::factory()->draft()->create();
    $user = User::factory()->asUser()->create();

    $this->actingAs($user)
        ->post(route('manage.articles.publish', $article))
        ->assertForbidden();
});
