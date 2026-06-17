<?php

declare(strict_types=1);

use App\Enums\EventRegistrationStatus;
use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Thread;
use App\Models\User;

test('guests are redirected to the login page', function (): void {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('the dashboard reports the user article and reputation stats', function (): void {
    $user = User::factory()->create();

    Article::factory()->for($user, 'author')->create([
        'status' => PublicationStatus::Published,
        'published_at' => now(),
        'views_count' => 100,
        'likes_count' => 10,
    ]);
    Article::factory()->for($user, 'author')->create([
        'status' => PublicationStatus::Published,
        'published_at' => now()->subMonths(2),
        'views_count' => 200,
        'likes_count' => 20,
    ]);

    // Drafts, scheduled posts, and other authors' articles must be ignored.
    Article::factory()->for($user, 'author')->draft()->create(['views_count' => 999, 'likes_count' => 999]);
    Article::factory()->for($user, 'author')->create([
        'status' => PublicationStatus::Published,
        'published_at' => now()->addWeek(),
        'views_count' => 999,
        'likes_count' => 999,
    ]);
    Article::factory()->create(['views_count' => 999, 'likes_count' => 999]);

    // Reactions left by others on the user's thread count toward reputation.
    $thread = Thread::factory()->for($user, 'author')->create();
    $thread->reactions()->create([
        'user_id' => User::factory()->create()->id,
        'type' => 'like',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/index')
            ->where('stats.articlesPublished', 2)
            ->where('stats.articlesThisMonth', 1)
            ->where('stats.totalViews', 300)
            ->where('stats.reputation', 31)
        );
});

test('the dashboard reports the user event registration stats', function (): void {
    $user = User::factory()->create();

    $upcoming = Event::factory()->create(['starts_at' => now()->addWeek()]);
    $past = Event::factory()->create([
        'starts_at' => now()->subWeek(),
        'ends_at' => now()->subWeek()->addHours(2),
    ]);
    $cancelledEvent = Event::factory()->create(['starts_at' => now()->addWeeks(2)]);

    EventRegistration::factory()->for($user)->for($upcoming)
        ->create(['status' => EventRegistrationStatus::Confirmed]);
    EventRegistration::factory()->for($user)->for($past)
        ->create(['status' => EventRegistrationStatus::Attended]);
    EventRegistration::factory()->for($user)->for($cancelledEvent)
        ->create(['status' => EventRegistrationStatus::Cancelled]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('stats.eventsRegistered', 2)
            ->where('stats.upcomingEvents', 1)
        );
});

test('the dashboard surfaces the soonest upcoming published event', function (): void {
    $user = User::factory()->create();

    Event::factory()->create(['starts_at' => now()->addMonths(2)]);
    $soonest = Event::factory()->create(['starts_at' => now()->addDays(3)]);
    Event::factory()->create([
        'starts_at' => now()->subMonth(),
        'ends_at' => now()->subMonth()->addHours(2),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('nextEvent.slug', $soonest->slug)
            ->where('nextEvent.title', $soonest->title)
        );
});

test('the dashboard shows no next event when none are upcoming', function (): void {
    $user = User::factory()->create();

    Event::factory()->create([
        'starts_at' => now()->subMonth(),
        'ends_at' => now()->subMonth()->addHours(2),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->where('nextEvent', null));
});
