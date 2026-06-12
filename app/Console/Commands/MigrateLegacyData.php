<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Event;
use App\Models\User;
use App\Notifications\LegacyPasswordNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Throwable;

#[Signature('app:migrate-legacy-data {--dry-run : Preview changes without writing} {--force : Skip confirmation prompts}')]
#[Description('Migrate data from the legacy laravel.sn database to the v2 schema')]
final class MigrateLegacyData extends Command
{
    /** @var array<int, int> old_id => new_id */
    private array $userIdMap = [];

    /** @var array<int, int> old_id => new_id */
    private array $tagIdMap = [];

    /** @var array<string, int> category_slug => new_tag_id */
    private array $categoryToTagMap = [];

    /** @var array<int, int> old_id => new_id */
    private array $articleIdMap = [];

    /** @var array<string, int> venue_name => new_id */
    private array $venueMap = [];

    /** @var list<array{user_id: int, email: string, provider: string, had_password: bool, plain_password: string|null}> */
    private array $oauthUsers = [];

    private int $adminUserId = 0;

    public function handle(): int
    {
        if (! $this->testLegacyConnection()) {
            return self::FAILURE;
        }

        $isDryRun = (bool) $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('DRY RUN — no data will be written.');
            $this->newLine();
        }

        $this->showPreMigrationSummary();

        if (! $isDryRun && ! $this->option('force') && ! $this->confirm('Proceed with migration?')) {
            $this->info('Migration cancelled.');

            return self::SUCCESS;
        }

        if ($isDryRun) {
            return self::SUCCESS;
        }

        DB::beginTransaction();

        try {
            $this->seedRolesAndPermissions();
            $this->migrateUsers();
            $this->migrateTags();
            $this->migrateArticles();
            $this->migrateArticleTagRelationships();
            $this->migrateArticleViewCounts();
            $this->migrateEvents();
            $this->applyNewsletterOptIn();
            $this->migrateMedia();
            $this->resetSequences();

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
            $this->error("Migration failed: {$e->getMessage()}");
            $this->error($e->getFile().':'.$e->getLine());

            return self::FAILURE;
        }

        $this->notifyOAuthUsers();
        $this->showPostMigrationSummary();

        return self::SUCCESS;
    }

    private function testLegacyConnection(): bool
    {
        try {
            DB::connection('legacy')->getPdo();
            $this->info('Connected to legacy database.');

            return true;
        } catch (Throwable $e) {
            $this->error("Cannot connect to legacy database: {$e->getMessage()}");
            $this->newLine();
            $this->warn('Add these to your .env file:');
            $this->line('  LEGACY_DB_CONNECTION=sqlite     # or pgsql, mysql');
            $this->line('  LEGACY_DB_HOST=127.0.0.1');
            $this->line('  LEGACY_DB_PORT=5432');
            $this->line('  LEGACY_DB_DATABASE=/path/to/legacy.sqlite');
            $this->line('  LEGACY_DB_USERNAME=');
            $this->line('  LEGACY_DB_PASSWORD=');

            return false;
        }
    }

    private function showPreMigrationSummary(): void
    {
        $legacy = fn (string $table) => DB::connection('legacy')->table($table);

        $counts = [
            ['Table', 'Legacy Count', 'Action'],
            ['users', $legacy('users')->count(), 'Migrate → users + Spatie roles'],
            ['articles', $legacy('articles')->count(), 'Migrate → articles (author = admin)'],
            ['categories', $legacy('categories')->count(), 'Convert → tags'],
            ['tags (Spatie)', $legacy('tags')->count(), 'Migrate → tags (simple format)'],
            ['events', $legacy('events')->count(), 'Migrate → events + venues'],
            ['media', $legacy('media')->count(), 'Migrate records (files need manual copy)'],
            ['newsletter_subscriptions', $legacy('newsletter_subscriptions')->count(), 'Apply → users.newsletter_opt_in'],
            ['views', $legacy('views')->count(), 'Aggregate → articles.views_count'],
            ['projects', $legacy('projects')->count(), 'DROPPED (no target table in v2)'],
            ['votes', $legacy('votes')->count(), 'DROPPED (no target table in v2)'],
        ];

        $oauthCount = $legacy('users')->whereNotNull('provider')->count();
        $linkedOauthCount = $legacy('users')
            ->whereIn('provider', ['github', 'google'])
            ->whereNotNull('provider_id')
            ->count();
        $droppedOauthCount = $oauthCount - $linkedOauthCount;
        $nullPasswordCount = $legacy('users')->whereNull('password')->count();

        $this->table($counts[0], array_slice($counts, 1));
        $this->newLine();

        if ($linkedOauthCount > 0) {
            $this->info("  {$linkedOauthCount} github/google user(s) — provider IDs migrated, social login keeps working.");
        }

        if ($droppedOauthCount > 0) {
            $this->warn("  {$droppedOauthCount} OAuth user(s) on unsupported providers — provider fields will be dropped.");
        }

        if ($nullPasswordCount > 0) {
            $this->warn("  {$nullPasswordCount} user(s) with no password — random passwords will be generated.");
        }

        $this->newLine();
    }

    private function seedRolesAndPermissions(): void
    {
        $this->info('Phase 1/9: Seeding roles & permissions...');

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'articles:publish',
            'articles:delete',
            'events:manage',
            'forum:moderate',
            'users:manage',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name]);
        }

        Role::firstOrCreate(['name' => 'user']);

        $moderator = Role::firstOrCreate(['name' => 'moderator']);
        $moderator->syncPermissions([
            'articles:publish',
            'events:manage',
            'forum:moderate',
        ]);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions($permissions);

        $this->info('  Roles & permissions ready.');
    }

    private function migrateUsers(): void
    {
        $this->info('Phase 2/9: Migrating users...');

        $legacyUsers = DB::connection('legacy')->table('users')->get();
        $existingEmails = DB::table('users')->pluck('id', 'email');
        $migrated = 0;
        $skipped = 0;

        foreach ($legacyUsers as $old) {
            if ($existingEmails->has($old->email)) {
                $this->userIdMap[$old->id] = $existingEmails[$old->email];
                $skipped++;

                continue;
            }

            $needsPassword = empty($old->password);
            $plainPassword = $needsPassword ? Str::random(16) : null;
            $generatedPassword = $needsPassword ? bcrypt($plainPassword) : null;

            $username = $this->generateUniqueUsername($old->name);

            /**
             * github/google identities carry over to the v2 social login
             * columns, so those users keep a seamless OAuth login and never
             * need a generated-password email.
             */
            $provider = $old->provider ?? null;
            $providerId = $old->provider_id ?? null;
            $keepsSocialLogin = in_array($provider, ['github', 'google'], true) && ! empty($providerId);

            $newId = DB::table('users')->insertGetId([
                'name' => $old->name,
                'username' => $username,
                'email' => $old->email,
                'email_verified_at' => $old->email_verified_at,
                'password' => $needsPassword ? $generatedPassword : $old->password,
                'github_id' => $keepsSocialLogin && $provider === 'github' ? (string) $providerId : null,
                'google_id' => $keepsSocialLogin && $provider === 'google' ? (string) $providerId : null,
                'remember_token' => $old->remember_token,
                'two_factor_secret' => $old->two_factor_secret ?? null,
                'two_factor_recovery_codes' => $old->two_factor_recovery_codes ?? null,
                'two_factor_confirmed_at' => $old->two_factor_confirmed_at ?? null,
                'created_at' => $old->created_at,
                'updated_at' => $old->updated_at,
            ]);

            $this->userIdMap[$old->id] = $newId;

            $role = ($old->role ?? 'user') === 'admin' ? 'admin' : 'user';
            DB::table('model_has_roles')->insert([
                'role_id' => Role::findByName($role)->id,
                'model_type' => User::class,
                'model_id' => $newId,
            ]);

            if ($role === 'admin' && $this->adminUserId === 0) {
                $this->adminUserId = $newId;
            }

            if (! empty($old->provider) && ! $keepsSocialLogin) {
                $this->oauthUsers[] = [
                    'user_id' => $newId,
                    'email' => $old->email,
                    'provider' => $old->provider,
                    'had_password' => ! $needsPassword,
                    'plain_password' => $plainPassword,
                ];
            }

            $migrated++;
        }

        if ($this->adminUserId === 0) {
            $this->adminUserId = (int) (DB::table('users')
                ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('roles.name', 'admin')
                ->where('model_has_roles.model_type', User::class)
                ->value('users.id') ?? DB::table('users')->min('id') ?? 0);
        }

        $this->info("  Migrated: {$migrated}, Skipped (existing): {$skipped}");
    }

    private function migrateTags(): void
    {
        $this->info('Phase 3/9: Migrating categories → tags + legacy tags...');

        $categoriesMigrated = 0;
        $tagsMigrated = 0;

        $legacyCategories = DB::connection('legacy')->table('categories')->get();

        foreach ($legacyCategories as $cat) {
            $slug = $cat->slug;
            $existing = DB::table('tags')->where('slug', $slug)->first();

            if ($existing) {
                $this->categoryToTagMap[$cat->slug] = $existing->id;

                continue;
            }

            $newId = DB::table('tags')->insertGetId([
                'name' => $cat->name,
                'slug' => $slug,
                'description' => "Imported from legacy category: {$cat->name}",
                'created_at' => $cat->created_at,
                'updated_at' => $cat->updated_at,
            ]);

            $this->categoryToTagMap[$cat->slug] = $newId;
            $categoriesMigrated++;
        }

        $legacyTags = DB::connection('legacy')->table('tags')->get();

        foreach ($legacyTags as $old) {
            $name = $this->extractFromSpatieJson($old->name);
            $slug = $this->extractFromSpatieJson($old->slug);

            if ($name === '' || $name === '0' || ($slug === '' || $slug === '0')) {
                continue;
            }

            $existing = DB::table('tags')->where('slug', $slug)->first();

            if ($existing) {
                $this->tagIdMap[$old->id] = $existing->id;

                continue;
            }

            $newId = DB::table('tags')->insertGetId([
                'name' => $name,
                'slug' => $slug,
                'created_at' => $old->created_at,
                'updated_at' => $old->updated_at,
            ]);

            $this->tagIdMap[$old->id] = $newId;
            $tagsMigrated++;
        }

        $this->info("  Categories → tags: {$categoriesMigrated}, Legacy tags: {$tagsMigrated}");
    }

    private function migrateArticles(): void
    {
        $this->info('Phase 4/9: Migrating articles...');

        $legacyArticles = DB::connection('legacy')->table('articles')->get();
        $existingSlugs = DB::table('articles')->pluck('id', 'slug');
        $migrated = 0;
        $skipped = 0;

        foreach ($legacyArticles as $old) {
            if ($existingSlugs->has($old->slug)) {
                $this->articleIdMap[$old->id] = $existingSlugs[$old->slug];
                $skipped++;

                continue;
            }

            $status = match ($old->status) {
                'published' => 'published',
                default => 'draft',
            };

            $newId = DB::table('articles')->insertGetId([
                'author_id' => $this->adminUserId,
                'title' => $old->title,
                'slug' => $old->slug,
                'body' => $old->content,
                'locale' => 'fr',
                'status' => $status,
                'published_at' => $old->published_at,
                'submitted_at' => $status === 'published' ? ($old->published_at ?? $old->created_at) : null,
                'approved_at' => $status === 'published' ? ($old->published_at ?? $old->created_at) : null,
                'reading_time_minutes' => $this->estimateReadingTime($old->content),
                'views_count' => 0,
                'likes_count' => 0,
                'is_featured' => false,
                'created_at' => $old->created_at,
                'updated_at' => $old->updated_at,
            ]);

            $this->articleIdMap[$old->id] = $newId;
            $migrated++;
        }

        $this->info("  Migrated: {$migrated}, Skipped (existing): {$skipped}");
    }

    private function migrateArticleTagRelationships(): void
    {
        $this->info('Phase 5/9: Migrating article-tag relationships...');

        $linked = 0;

        $legacyArticleCategories = DB::connection('legacy')->table('article_category')->get();
        $legacyCategories = DB::connection('legacy')->table('categories')->pluck('slug', 'id');

        foreach ($legacyArticleCategories as $pivot) {
            $articleId = $this->articleIdMap[$pivot->article_id] ?? null;
            $categorySlug = $legacyCategories[$pivot->category_id] ?? null;
            $tagId = $categorySlug ? ($this->categoryToTagMap[$categorySlug] ?? null) : null;

            if (! $articleId || ! $tagId) {
                continue;
            }

            $exists = DB::table('taggables')
                ->where('tag_id', $tagId)
                ->where('taggable_id', $articleId)
                ->where('taggable_type', Article::class)
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('taggables')->insert([
                'tag_id' => $tagId,
                'taggable_id' => $articleId,
                'taggable_type' => Article::class,
            ]);

            $linked++;
        }

        $directCategories = DB::connection('legacy')->table('articles')
            ->whereNotNull('category_id')
            ->select('id', 'category_id')
            ->get();

        foreach ($directCategories as $article) {
            $articleId = $this->articleIdMap[$article->id] ?? null;
            $categorySlug = $legacyCategories[$article->category_id] ?? null;
            $tagId = $categorySlug ? ($this->categoryToTagMap[$categorySlug] ?? null) : null;

            if (! $articleId || ! $tagId) {
                continue;
            }

            $exists = DB::table('taggables')
                ->where('tag_id', $tagId)
                ->where('taggable_id', $articleId)
                ->where('taggable_type', Article::class)
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('taggables')->insert([
                'tag_id' => $tagId,
                'taggable_id' => $articleId,
                'taggable_type' => Article::class,
            ]);

            $linked++;
        }

        $legacyTaggables = DB::connection('legacy')->table('taggables')->get();

        foreach ($legacyTaggables as $pivot) {
            $tagId = $this->tagIdMap[$pivot->tag_id] ?? null;

            if (! $tagId) {
                continue;
            }

            $newModelId = match ($pivot->taggable_type) {
                Article::class => $this->articleIdMap[$pivot->taggable_id] ?? null,
                default => null,
            };

            if (! $newModelId) {
                continue;
            }

            $exists = DB::table('taggables')
                ->where('tag_id', $tagId)
                ->where('taggable_id', $newModelId)
                ->where('taggable_type', $pivot->taggable_type)
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('taggables')->insert([
                'tag_id' => $tagId,
                'taggable_id' => $newModelId,
                'taggable_type' => $pivot->taggable_type,
            ]);

            $linked++;
        }

        $this->info("  Article-tag links created: {$linked}");
    }

    private function migrateArticleViewCounts(): void
    {
        $this->info('Phase 6/9: Aggregating view counts...');

        $updated = 0;

        $viewCounts = DB::connection('legacy')->table('views')
            ->where('viewable_type', Article::class)
            ->select('viewable_id', DB::raw('COUNT(DISTINCT visitor) as unique_views'))
            ->groupBy('viewable_id')
            ->get();

        foreach ($viewCounts as $row) {
            $newArticleId = $this->articleIdMap[$row->viewable_id] ?? null;

            if (! $newArticleId) {
                continue;
            }

            DB::table('articles')
                ->where('id', $newArticleId)
                ->update(['views_count' => $row->unique_views]);

            $updated++;
        }

        $this->info("  Articles with view counts updated: {$updated}");
    }

    private function migrateEvents(): void
    {
        $this->info('Phase 7/9: Migrating events → venues + events...');

        $legacyEvents = DB::connection('legacy')->table('events')->get();
        $venuesCreated = 0;
        $eventsMigrated = 0;
        $eventsSkipped = 0;

        foreach ($legacyEvents as $old) {
            $slug = Str::slug($old->name);
            $existingEvent = DB::table('events')->where('slug', $slug)->first();

            if ($existingEvent) {
                $eventsSkipped++;

                continue;
            }

            $venueId = null;
            $place = trim($old->place ?? '');

            if ($place !== '') {
                if (! isset($this->venueMap[$place])) {
                    $existingVenue = DB::table('venues')->where('name', $place)->first();

                    if ($existingVenue) {
                        $this->venueMap[$place] = $existingVenue->id;
                    } else {
                        $this->venueMap[$place] = DB::table('venues')->insertGetId([
                            'name' => $place,
                            'slug' => Str::slug($place),
                            'address' => $place,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                        $venuesCreated++;
                    }
                }

                $venueId = $this->venueMap[$place];
            }

            $slugBase = $slug;
            $counter = 1;
            while (DB::table('events')->where('slug', $slug)->exists()) {
                $slug = "{$slugBase}-{$counter}";
                $counter++;
            }

            $seoMeta = [];
            if (! empty($old->rsvp_link)) {
                $seoMeta['rsvp_link'] = $old->rsvp_link;
            }
            if (! empty($old->event_link)) {
                $seoMeta['event_link'] = $old->event_link;
            }

            DB::table('events')->insert([
                'venue_id' => $venueId,
                'title' => $old->name,
                'slug' => $slug,
                'format' => 'meetup',
                'description' => $old->description,
                'starts_at' => $old->date,
                'is_online' => false,
                'online_url' => $old->event_link,
                'status' => ($old->is_published ?? true) ? 'published' : 'draft',
                'is_featured' => false,
                'is_sponsored' => false,
                'waitlist_capacity' => 0,
                'seo_meta' => $seoMeta === [] ? null : json_encode($seoMeta),
                'created_at' => $old->created_at,
                'updated_at' => $old->updated_at,
            ]);

            $eventsMigrated++;
        }

        $this->info("  Venues created: {$venuesCreated}, Events migrated: {$eventsMigrated}, Skipped: {$eventsSkipped}");
    }

    private function applyNewsletterOptIn(): void
    {
        $this->info('Phase 8/9: Applying newsletter opt-in...');

        $subscribers = DB::connection('legacy')->table('newsletter_subscriptions')
            ->where('status', 'subscribed')
            ->pluck('email');

        $updated = 0;

        foreach ($subscribers as $email) {
            $affected = DB::table('users')
                ->where('email', $email)
                ->where('newsletter_opt_in', false)
                ->update(['newsletter_opt_in' => true]);

            $updated += $affected;
        }

        $this->info("  Users opted-in to newsletter: {$updated} (of {$subscribers->count()} subscribers)");
    }

    private function migrateMedia(): void
    {
        $this->info('Phase 9/9: Migrating media records...');

        $legacyMedia = DB::connection('legacy')->table('media')->get();
        $mediaDisk = (string) config('media-library.disk_name');
        $migrated = 0;
        $skipped = 0;

        foreach ($legacyMedia as $old) {
            if ($old->uuid && DB::table('media')->where('uuid', $old->uuid)->exists()) {
                $skipped++;

                continue;
            }

            $newModelId = match ($old->model_type) {
                User::class => $this->userIdMap[$old->model_id] ?? null,
                Article::class => $this->articleIdMap[$old->model_id] ?? null,
                Event::class => null,
                default => null,
            };

            if ($newModelId === null) {
                $skipped++;

                continue;
            }

            $collectionName = $old->collection_name;
            if ($old->model_type === User::class && $collectionName === 'profile-photo') {
                $collectionName = 'avatar';
            }

            // Legacy ids are preserved because Spatie stores files under
            // {media_id}/{file_name} — copied files must keep resolving.
            DB::table('media')->insert([
                'id' => $old->id,
                'model_type' => $old->model_type,
                'model_id' => $newModelId,
                'uuid' => $old->uuid,
                'collection_name' => $collectionName,
                'name' => $old->name,
                'file_name' => $old->file_name,
                'mime_type' => $old->mime_type,
                'disk' => $mediaDisk,
                'conversions_disk' => $mediaDisk,
                'size' => $old->size,
                'manipulations' => $old->manipulations,
                'custom_properties' => $old->custom_properties,
                'generated_conversions' => $old->generated_conversions,
                'responsive_images' => $old->responsive_images,
                'order_column' => $old->order_column,
                'created_at' => $old->created_at,
                'updated_at' => $old->updated_at,
            ]);

            $migrated++;
        }

        $this->info("  Media records migrated: {$migrated}, Skipped: {$skipped}");

        if ($migrated > 0) {
            $this->newLine();
            $this->warn('  IMPORTANT: Media files must be copied manually from the old server.');
            $this->line("  Copy the legacy storage/app/public/ contents to the '{$mediaDisk}' disk,");
            $this->line('  keeping the {media_id}/{file_name} directory layout.');
            $this->line('  Example: rclone copy old-server:storage/app/public/ remote:bucket/');
        }
    }

    private function notifyOAuthUsers(): void
    {
        $usersToNotify = array_filter($this->oauthUsers, fn (array $u): bool => $u['plain_password'] !== null);

        if ($usersToNotify === []) {
            return;
        }

        $this->info('Sending password emails to OAuth users...');

        $sent = 0;

        foreach ($usersToNotify as $data) {
            $user = User::find($data['user_id']);

            if (! $user) {
                continue;
            }

            $user->notify(new LegacyPasswordNotification($data['plain_password'], $data['provider']));
            $sent++;
        }

        $this->info("  Password emails queued: {$sent}");
    }

    private function resetSequences(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver !== 'pgsql') {
            return;
        }

        $tables = ['users', 'tags', 'articles', 'events', 'venues', 'media'];

        foreach ($tables as $table) {
            $max = DB::table($table)->max('id');

            if ($max) {
                DB::statement("SELECT setval('{$table}_id_seq', {$max})");
            }
        }
    }

    private function showPostMigrationSummary(): void
    {
        $this->newLine();
        $this->info('Migration completed successfully!');
        $this->newLine();

        $this->table(
            ['Entity', 'Count'],
            [
                ['Users migrated', count($this->userIdMap)],
                ['Tags created (from categories)', count($this->categoryToTagMap)],
                ['Tags created (from legacy tags)', count($this->tagIdMap)],
                ['Articles migrated', count($this->articleIdMap)],
                ['Venues created', count($this->venueMap)],
            ]
        );

        if ($this->oauthUsers !== []) {
            $this->newLine();
            $this->warn('OAuth users requiring attention:');
            $this->table(
                ['Email', 'Provider', 'Had Password'],
                array_map(fn (array $u): array => [
                    $u['email'],
                    $u['provider'],
                    $u['had_password'] ? 'Yes' : 'No — random password generated',
                ], $this->oauthUsers)
            );
            $this->line('  These users should reset their password or re-link their OAuth provider.');
        }

        $this->newLine();
        $this->warn('Post-migration checklist:');
        $this->line('  1. Copy media files from old server (see rsync command above)');
        $this->line('  2. Verify user accounts can log in');
        $this->line('  3. Verify articles display correctly');
        $this->line('  4. Verify events display correctly');
        $this->line('  5. Notify OAuth users to reset their passwords');
        $this->line('  6. Remove the "legacy" database connection from config/database.php when done');
    }

    /**
     * Extract a plain string from Spatie Tags JSON format.
     * Spatie stores {"en": "value"} or {"fr": "value"} — we prefer 'fr'.
     */
    private function extractFromSpatieJson(mixed $value): string
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);

            if (is_array($decoded)) {
                return (string) ($decoded['fr'] ?? $decoded['en'] ?? reset($decoded) ?: '');
            }

            return $value;
        }

        if (is_array($value)) {
            return (string) ($value['fr'] ?? $value['en'] ?? reset($value) ?: '');
        }

        return (string) ($value ?? '');
    }

    private function generateUniqueUsername(string $name): string
    {
        $base = Str::slug($name, '');
        $username = $base;
        $counter = 1;

        while (DB::table('users')->where('username', $username)->exists()) {
            $username = "{$base}{$counter}";
            $counter++;
        }

        return $username;
    }

    private function estimateReadingTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));

        return max(1, (int) ceil($wordCount / 200));
    }
}
