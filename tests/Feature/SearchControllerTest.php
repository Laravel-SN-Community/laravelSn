<?php

declare(strict_types=1);

use App\Models\Article;
use App\Models\Thread;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(fn () => $this->seed(RolesAndPermissionsSeeder::class));

// ── empty query ────────────────────────────────────────────────────────────

test('returns empty results for blank query', function (): void {
    $this->getJson(route('search'))
        ->assertOk()
        ->assertJson([
            'articles' => [],
            'threads' => [],
            'members' => [],
        ]);
});

test('returns empty results for whitespace-only query', function (): void {
    $this->getJson(route('search', ['q' => '   ']))
        ->assertOk()
        ->assertJson([
            'articles' => [],
            'threads' => [],
            'members' => [],
        ]);
});

// ── articles ───────────────────────────────────────────────────────────────

test('returns published articles matching query', function (): void {
    $article = Article::factory()->create(['title' => 'Laravel Tips and Tricks']);
    Article::factory()->create(['title' => 'Vue.js Guide']);

    $response = $this->getJson(route('search', ['q' => 'Laravel']));

    $response->assertOk()
        ->assertJsonCount(1, 'articles')
        ->assertJsonPath('articles.0.id', $article->id)
        ->assertJsonPath('articles.0.title', $article->title)
        ->assertJsonStructure(['articles' => [['id', 'title', 'author', 'url']]]);
});

test('does not return draft articles in search results', function (): void {
    Article::factory()->draft()->create(['title' => 'Laravel Draft Post']);

    $this->getJson(route('search', ['q' => 'Laravel']))
        ->assertOk()
        ->assertJsonCount(0, 'articles');
});

// ── threads ────────────────────────────────────────────────────────────────

test('returns threads matching query', function (): void {
    $thread = Thread::factory()->create(['title' => 'How to use Eloquent relationships']);
    Thread::factory()->create(['title' => 'Getting started with React']);

    $response = $this->getJson(route('search', ['q' => 'Eloquent']));

    $response->assertOk()
        ->assertJsonCount(1, 'threads')
        ->assertJsonPath('threads.0.id', $thread->id)
        ->assertJsonPath('threads.0.title', $thread->title)
        ->assertJsonStructure(['threads' => [['id', 'title', 'author', 'url']]]);
});

// ── members ────────────────────────────────────────────────────────────────

test('returns members matching query', function (): void {
    $user = User::factory()->create(['name' => 'Amadou Diallo', 'username' => 'amadou']);
    User::factory()->create(['name' => 'Fatou Ndiaye', 'username' => 'fatou']);

    $response = $this->getJson(route('search', ['q' => 'Amadou']));

    $response->assertOk()
        ->assertJsonCount(1, 'members')
        ->assertJsonPath('members.0.id', $user->id)
        ->assertJsonPath('members.0.username', $user->username)
        ->assertJsonStructure(['members' => [['id', 'name', 'username', 'avatar', 'url']]]);
});

// ── response structure ─────────────────────────────────────────────────────

test('search response always contains all three groups', function (): void {
    $this->getJson(route('search', ['q' => 'laravel']))
        ->assertOk()
        ->assertJsonStructure(['articles', 'threads', 'members']);
});
