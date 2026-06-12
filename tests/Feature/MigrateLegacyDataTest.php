<?php

declare(strict_types=1);

use App\Models\Article;
use App\Models\User;
use App\Notifications\LegacyPasswordNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    config(['database.connections.legacy' => [
        'driver' => 'sqlite',
        'database' => ':memory:',
        'prefix' => '',
        'foreign_key_constraints' => true,
    ]]);

    seedLegacySchema();
});

// ── helpers ────────────────────────────────────────────────────────────────

function seedLegacySchema(): void
{
    $legacy = DB::connection('legacy');

    $legacy->statement('CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT "user",
        email_verified_at TEXT,
        password TEXT,
        remember_token TEXT,
        two_factor_secret TEXT,
        two_factor_recovery_codes TEXT,
        two_factor_confirmed_at TEXT,
        provider TEXT,
        provider_id TEXT,
        provider_token TEXT,
        current_team_id INTEGER,
        profile_photo_path TEXT,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT "draft",
        category_id INTEGER,
        published_at TEXT,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE article_category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        type TEXT,
        order_column INTEGER,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE taggables (
        tag_id INTEGER NOT NULL,
        taggable_type TEXT NOT NULL,
        taggable_id INTEGER NOT NULL
    )');

    $legacy->statement('CREATE TABLE events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        place TEXT NOT NULL,
        description TEXT NOT NULL,
        rsvp_link TEXT,
        event_link TEXT,
        is_published INTEGER NOT NULL DEFAULT 1,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE newsletter_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        subscribed_at TEXT,
        unsubscribed_at TEXT,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        viewable_type TEXT NOT NULL,
        viewable_id INTEGER NOT NULL,
        visitor TEXT,
        collection TEXT,
        viewed_at TEXT NOT NULL
    )');

    $legacy->statement('CREATE TABLE media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_type TEXT NOT NULL,
        model_id INTEGER NOT NULL,
        uuid TEXT UNIQUE,
        collection_name TEXT NOT NULL,
        name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT,
        disk TEXT NOT NULL,
        conversions_disk TEXT,
        size INTEGER NOT NULL,
        manipulations TEXT NOT NULL DEFAULT "[]",
        custom_properties TEXT NOT NULL DEFAULT "[]",
        generated_conversions TEXT NOT NULL DEFAULT "[]",
        responsive_images TEXT NOT NULL DEFAULT "[]",
        order_column INTEGER,
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        github_link TEXT,
        project_link TEXT,
        status TEXT NOT NULL DEFAULT "pending",
        created_at TEXT,
        updated_at TEXT
    )');

    $legacy->statement('CREATE TABLE votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        created_at TEXT,
        updated_at TEXT
    )');
}

// ── tests ──────────────────────────────────────────────────────────────────

test('it migrates users with correct role mapping', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        ['name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin', 'password' => bcrypt('password'), 'created_at' => $now, 'updated_at' => $now],
        ['name' => 'Regular', 'email' => 'user@test.com', 'role' => 'user', 'password' => bcrypt('password'), 'created_at' => $now, 'updated_at' => $now],
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    expect(DB::table('users')->count())->toBe(2);
    expect(DB::table('model_has_roles')->count())->toBe(2);

    $admin = DB::table('users')->where('email', 'admin@test.com')->first();
    $adminRole = DB::table('model_has_roles')
        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
        ->where('model_has_roles.model_id', $admin->id)
        ->value('roles.name');

    expect($adminRole)->toBe('admin');
});

test('it migrates github and google provider ids so social login keeps working', function (): void {
    Notification::fake();

    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        [
            'name' => 'GitHub User',
            'email' => 'github@test.com',
            'role' => 'user',
            'password' => null,
            'provider' => 'github',
            'provider_id' => '12345',
            'provider_token' => 'token',
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            'name' => 'Google User',
            'email' => 'google@test.com',
            'role' => 'user',
            'password' => null,
            'provider' => 'google',
            'provider_id' => '99887',
            'provider_token' => 'token',
            'created_at' => $now,
            'updated_at' => $now,
        ],
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $githubUser = DB::table('users')->where('email', 'github@test.com')->first();
    $googleUser = DB::table('users')->where('email', 'google@test.com')->first();

    expect($githubUser->github_id)->toBe('12345');
    expect($githubUser->google_id)->toBeNull();
    expect($googleUser->google_id)->toBe('99887');
    expect($githubUser->password)->not->toBeEmpty();

    // Their social login carries over — no generated-password email needed.
    Notification::assertNothingSent();
});

test('it generates passwords and notifies oauth users on unsupported providers', function (): void {
    Notification::fake();

    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'OAuth User',
        'email' => 'oauth@test.com',
        'role' => 'user',
        'password' => null,
        'provider' => 'twitter',
        'provider_id' => '12345',
        'provider_token' => 'token',
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $user = DB::table('users')->where('email', 'oauth@test.com')->first();

    expect($user)->not->toBeNull();
    expect($user->github_id)->toBeNull();
    expect($user->password)->not->toBeNull();
    expect($user->password)->not->toBeEmpty();

    $userModel = User::find($user->id);
    Notification::assertSentTo($userModel, LegacyPasswordNotification::class, function ($notification): true {
        expect($notification->provider)->toBe('twitter');
        expect($notification->plainPassword)->toHaveLength(16);

        return true;
    });
});

test('it converts categories to tags and links articles', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('categories')->insert([
        ['name' => 'Laravel', 'slug' => 'laravel', 'created_at' => $now, 'updated_at' => $now],
        ['name' => 'PHP', 'slug' => 'php', 'created_at' => $now, 'updated_at' => $now],
    ]);

    DB::connection('legacy')->table('articles')->insert([
        'title' => 'Test Article',
        'slug' => 'test-article',
        'content' => 'Some content here for testing.',
        'status' => 'published',
        'category_id' => 1,
        'published_at' => $now,
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('article_category')->insert([
        ['article_id' => 1, 'category_id' => 1, 'created_at' => $now, 'updated_at' => $now],
        ['article_id' => 1, 'category_id' => 2, 'created_at' => $now, 'updated_at' => $now],
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    expect(DB::table('tags')->count())->toBe(2);
    expect(DB::table('tags')->where('slug', 'laravel')->exists())->toBeTrue();
    expect(DB::table('tags')->where('slug', 'php')->exists())->toBeTrue();

    $article = DB::table('articles')->where('slug', 'test-article')->first();
    expect($article)->not->toBeNull();

    $tagLinks = DB::table('taggables')
        ->where('taggable_id', $article->id)
        ->where('taggable_type', Article::class)
        ->count();

    expect($tagLinks)->toBe(2);
});

test('it migrates articles with correct field mapping', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('articles')->insert([
        'title' => 'My Article',
        'slug' => 'my-article',
        'content' => 'This is the content of my article with enough words to measure reading time.',
        'status' => 'published',
        'published_at' => $now,
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $article = DB::table('articles')->where('slug', 'my-article')->first();

    expect($article->body)->toBe('This is the content of my article with enough words to measure reading time.');
    expect($article->status)->toBe('published');
    expect($article->locale)->toBe('fr');
    expect($article->author_id)->not->toBeNull();
    expect($article->reading_time_minutes)->toBeGreaterThanOrEqual(1);
});

test('it aggregates view counts onto articles', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('articles')->insert([
        'title' => 'Viewed Article', 'slug' => 'viewed-article',
        'content' => 'Content.', 'status' => 'published',
        'published_at' => $now, 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('views')->insert([
        ['viewable_type' => Article::class, 'viewable_id' => 1, 'visitor' => '1.1.1.1', 'viewed_at' => $now],
        ['viewable_type' => Article::class, 'viewable_id' => 1, 'visitor' => '2.2.2.2', 'viewed_at' => $now],
        ['viewable_type' => Article::class, 'viewable_id' => 1, 'visitor' => '1.1.1.1', 'viewed_at' => $now],
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $article = DB::table('articles')->where('slug', 'viewed-article')->first();

    expect((int) $article->views_count)->toBe(2);
});

test('it migrates events and creates venues from places', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('events')->insert([
        ['name' => 'LaravelSN Meetup #1', 'date' => '2025-06-15 18:00:00', 'place' => 'Dakar Hub', 'description' => 'First meetup.', 'is_published' => 1, 'created_at' => $now, 'updated_at' => $now],
        ['name' => 'LaravelSN Meetup #2', 'date' => '2025-07-20 18:00:00', 'place' => 'Dakar Hub', 'description' => 'Second meetup.', 'is_published' => 0, 'created_at' => $now, 'updated_at' => $now],
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    expect(DB::table('venues')->count())->toBe(1);
    expect(DB::table('venues')->where('name', 'Dakar Hub')->exists())->toBeTrue();

    expect(DB::table('events')->count())->toBe(2);

    $published = DB::table('events')->where('title', 'LaravelSN Meetup #1')->first();
    $draft = DB::table('events')->where('title', 'LaravelSN Meetup #2')->first();

    expect($published->status)->toBe('published');
    expect($published->format)->toBe('meetup');
    expect($published->venue_id)->not->toBeNull();

    expect($draft->status)->toBe('draft');
});

test('it applies newsletter opt-in to matching users', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Subscriber', 'email' => 'sub@test.com', 'role' => 'user',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('newsletter_subscriptions')->insert([
        'email' => 'sub@test.com', 'status' => 'subscribed',
        'subscribed_at' => $now, 'created_at' => $now, 'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $user = DB::table('users')->where('email', 'sub@test.com')->first();
    expect((bool) $user->newsletter_opt_in)->toBeTrue();
});

test('it skips duplicate users by email', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Existing', 'email' => 'existing@test.com', 'role' => 'user',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::table('users')->insert([
        'name' => 'Already Here', 'email' => 'existing@test.com',
        'password' => bcrypt('different'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    expect(DB::table('users')->where('email', 'existing@test.com')->count())->toBe(1);
    expect(DB::table('users')->where('email', 'existing@test.com')->value('name'))->toBe('Already Here');
});

test('it migrates spatie json tags to simple format', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('tags')->insert([
        'name' => json_encode(['fr' => 'Laravel', 'en' => 'Laravel']),
        'slug' => json_encode(['fr' => 'laravel', 'en' => 'laravel']),
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $tag = DB::table('tags')->where('slug', 'laravel')->first();

    expect($tag)->not->toBeNull();
    expect($tag->name)->toBe('Laravel');
});

test('it is idempotent when run twice', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Admin', 'email' => 'admin@test.com', 'role' => 'admin',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('articles')->insert([
        'title' => 'Article', 'slug' => 'article', 'content' => 'Content.',
        'status' => 'published', 'published_at' => $now,
        'created_at' => $now, 'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])->assertExitCode(0);
    $this->artisan('app:migrate-legacy-data', ['--force' => true])->assertExitCode(0);

    expect(DB::table('users')->count())->toBe(1);
    expect(DB::table('articles')->count())->toBe(1);
});

test('dry run does not write any data', function (): void {
    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'name' => 'Test', 'email' => 'test@test.com', 'role' => 'user',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--dry-run' => true])
        ->assertExitCode(0);

    expect(DB::table('users')->count())->toBe(0);
});

test('it preserves legacy media ids and points records at the configured media disk', function (): void {
    config(['media-library.disk_name' => 's3']);

    $now = now()->toDateTimeString();

    DB::connection('legacy')->table('users')->insert([
        'id' => 3, 'name' => 'Avatar User', 'email' => 'avatar@test.com', 'role' => 'user',
        'password' => bcrypt('pw'), 'created_at' => $now, 'updated_at' => $now,
    ]);

    DB::connection('legacy')->table('media')->insert([
        'id' => 7,
        'model_type' => User::class,
        'model_id' => 3,
        'uuid' => 'legacy-uuid-7',
        'collection_name' => 'profile-photo',
        'name' => 'avatar',
        'file_name' => 'avatar.jpg',
        'mime_type' => 'image/jpeg',
        'disk' => 'public',
        'conversions_disk' => 'public',
        'size' => 1234,
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $this->artisan('app:migrate-legacy-data', ['--force' => true])
        ->assertExitCode(0);

    $media = DB::table('media')->where('uuid', 'legacy-uuid-7')->first();
    $user = DB::table('users')->where('email', 'avatar@test.com')->first();

    // Spatie stores files under {media_id}/{file_name}, so copied legacy
    // files only resolve when the legacy id survives the import.
    expect($media)->not->toBeNull();
    expect((int) $media->id)->toBe(7);
    expect($media->disk)->toBe('s3');
    expect($media->conversions_disk)->toBe('s3');
    expect($media->collection_name)->toBe('avatar');
    expect((int) $media->model_id)->toBe((int) $user->id);
});
