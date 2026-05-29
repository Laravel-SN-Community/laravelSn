<?php

declare(strict_types=1);

use App\Models\Article;
use App\Models\User;

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
