<?php

declare(strict_types=1);

use App\Models\Article;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => $this->seed(RolesAndPermissionsSeeder::class));

test('guests can view a user profile', function (): void {
    $user = User::factory()->create();

    $this->get("/@{$user->username}")->assertOk();
});

test('profile page returns 404 for a nonexistent username', function (): void {
    $this->get('/@nobody-here')->assertNotFound();
});

test('profile page only shows published articles', function (): void {
    $user = User::factory()->create();
    Article::factory()->for($user, 'author')->create();
    Article::factory()->draft()->for($user, 'author')->create();

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('membres/show')
            ->count('articles', 1)
        );
});

test('profile page shows correct user data', function (): void {
    $user = User::factory()->create([
        'bio' => 'Full-stack developer',
        'location' => 'Dakar',
    ]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('membres/show')
            ->where('user.username', $user->username)
            ->where('user.bio', 'Full-stack developer')
            ->where('user.location', 'Dakar')
        );
});

test('profile page includes threads for the user', function (): void {
    $user = User::factory()->create();
    Thread::factory()->count(3)->create(['user_id' => $user->id]);
    Thread::factory()->create();

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->has('threads', 3)
        );
});

test('profile page includes replies for the user', function (): void {
    $user = User::factory()->create();
    $thread = Thread::factory()->create();
    Reply::factory()->count(2)->create(['thread_id' => $thread->id, 'user_id' => $user->id]);
    Reply::factory()->create(['thread_id' => $thread->id]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->has('replies', 2)
        );
});

test('profile page includes solutions for the user', function (): void {
    $user = User::factory()->create();
    $thread = Thread::factory()->create(['user_id' => $user->id]);
    $reply = Reply::factory()->create(['thread_id' => $thread->id, 'user_id' => $user->id]);
    $thread->update(['solution_reply_id' => $reply->id]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->has('solutions', 1)
        );
});

test('profile page returns empty solutions when user has none', function (): void {
    $user = User::factory()->create();
    Thread::factory()->create(['user_id' => $user->id]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->has('solutions', 0)
        );
});

test('profile page builds activity from articles threads and replies', function (): void {
    $user = User::factory()->create();
    Article::factory()->for($user, 'author')->create();
    Thread::factory()->create(['user_id' => $user->id]);
    $thread = Thread::factory()->create();
    Reply::factory()->create(['thread_id' => $thread->id, 'user_id' => $user->id]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->has('activity', 3)
        );
});

test('profile page activity is sorted by date descending', function (): void {
    $user = User::factory()->create();
    Thread::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(5)]);
    Article::factory()->for($user, 'author')->create(['published_at' => now()->subDay()]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->has('activity', 2)
            ->where('activity.0.type', 'article')
            ->where('activity.1.type', 'thread')
        );
});

test('profile page reply activity urls include anchor hash', function (): void {
    $user = User::factory()->create();
    $thread = Thread::factory()->create();
    $reply = Reply::factory()->create(['thread_id' => $thread->id, 'user_id' => $user->id]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->where('activity.0.url', "/forum/threads/{$thread->slug}#reply-{$reply->id}")
        );
});

test('profile page thread urls use correct path', function (): void {
    $user = User::factory()->create();
    $thread = Thread::factory()->create(['user_id' => $user->id]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->where('activity.0.url', "/forum/threads/{$thread->slug}")
        );
});

test('profile page shows user role', function (): void {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->where('user.role', 'admin')
        );
});

test('profile page shows null role for regular users', function (): void {
    $user = User::factory()->create();

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->where('user.role', null)
        );
});

test('profile page includes social handles in user data', function (): void {
    $user = User::factory()->create([
        'github_handle' => 'johndoe',
        'twitter_handle' => 'johndoe',
        'website_url' => 'https://johndoe.dev',
    ]);

    $this->get("/@{$user->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('membres/show')
            ->where('user.github_handle', 'johndoe')
            ->where('user.twitter_handle', 'johndoe')
            ->where('user.website_url', 'https://johndoe.dev')
        );
});
