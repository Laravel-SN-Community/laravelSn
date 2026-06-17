<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Event;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportLegacyDb extends Command
{
    protected $signature = 'import:legacy-db
                            {file : Path to the SQL dump file}
                            {--dry-run : Show counts without inserting}';

    protected $description = 'Import legacy Laravel Senegal data from a SQL dump file';

    private string $sql = '';

    /** @var array<int, int> */
    private array $tagIdMap = [];

    /** @var array<int, int> */
    private array $articleIdMap = [];

    /** @var array<int, int> */
    private array $eventIdMap = [];

    public function handle(): int
    {
        $file = $this->argument('file');
        $dryRun = $this->option('dry-run');

        if (! file_exists($file)) {
            $this->error("File not found: {$file}");

            return self::FAILURE;
        }

        $this->info('Reading dump file...');
        $this->sql = file_get_contents($file);

        if ($dryRun) {
            $this->info('--- DRY RUN MODE ---');
        }

        $this->importUsers($dryRun);
        $this->importTags($dryRun);
        $this->importArticles($dryRun);
        $this->importEvents($dryRun);
        $this->importMedia($dryRun);
        $this->importTaggables($dryRun);

        $this->newLine();
        $this->info('Import complete.');

        return self::SUCCESS;
    }

    private function importUsers(bool $dryRun): void
    {
        $rows = $this->parseDumpTable('users');
        $skipped = 0;
        $imported = 0;

        foreach ($rows as $row) {
            if (User::where('email', $row['email'])->exists()) {
                $skipped++;

                continue;
            }

            $githubId = null;
            $googleId = null;

            if ($row['provider'] === 'github') {
                $githubId = $row['provider_id'] !== 'NULL' ? $row['provider_id'] : null;
            } elseif ($row['provider'] === 'google') {
                $googleId = $row['provider_id'] !== 'NULL' ? $row['provider_id'] : null;
            }

            if (! $dryRun) {
                User::create([
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'password' => $row['password'] !== 'NULL' ? $row['password'] : '!',
                    'email_verified_at' => $row['email_verified_at'] !== 'NULL' ? $row['email_verified_at'] : null,
                    'two_factor_secret' => $row['two_factor_secret'] !== 'NULL' ? $row['two_factor_secret'] : null,
                    'two_factor_recovery_codes' => $row['two_factor_recovery_codes'] !== 'NULL' ? $row['two_factor_recovery_codes'] : null,
                    'two_factor_confirmed_at' => $row['two_factor_confirmed_at'] !== 'NULL' ? $row['two_factor_confirmed_at'] : null,
                    'remember_token' => $row['remember_token'] !== 'NULL' ? $row['remember_token'] : null,
                    'avatar_path' => $row['profile_photo_path'] !== 'NULL' ? $row['profile_photo_path'] : null,
                    'github_id' => $githubId,
                    'google_id' => $googleId,
                    'created_at' => $row['created_at'] !== 'NULL' ? $row['created_at'] : now(),
                    'updated_at' => $row['updated_at'] !== 'NULL' ? $row['updated_at'] : now(),
                ]);
            }

            $imported++;
        }

        $this->line("Users: {$imported} imported, {$skipped} skipped (already exist).");
    }

    private function importTags(bool $dryRun): void
    {
        $rows = $this->parseDumpTable('tags');
        $skipped = 0;
        $imported = 0;

        foreach ($rows as $row) {
            $name = $this->extractJsonLocale($row['name']);
            $slug = $this->extractJsonLocale($row['slug']);

            if (Tag::where('slug', $slug)->exists()) {
                $existing = Tag::where('slug', $slug)->first();
                $this->tagIdMap[(int) $row['id']] = $existing->id;
                $skipped++;

                continue;
            }

            if (! $dryRun) {
                $tag = Tag::create([
                    'name' => $name,
                    'slug' => $slug,
                    'created_at' => $row['created_at'] !== 'NULL' ? $row['created_at'] : now(),
                    'updated_at' => $row['updated_at'] !== 'NULL' ? $row['updated_at'] : now(),
                ]);
                $this->tagIdMap[(int) $row['id']] = $tag->id;
            }

            $imported++;
        }

        $this->line("Tags: {$imported} imported, {$skipped} skipped (already exist).");
    }

    private function importArticles(bool $dryRun): void
    {
        $rows = $this->parseDumpTable('articles');
        $authorId = User::orderBy('id')->value('id');
        $skipped = 0;
        $imported = 0;

        foreach ($rows as $row) {
            if (Article::where('slug', $row['slug'])->exists()) {
                $existing = Article::where('slug', $row['slug'])->first();
                $this->articleIdMap[(int) $row['id']] = $existing->id;
                $skipped++;

                continue;
            }

            if (! $dryRun) {
                $article = Article::create([
                    'author_id' => $authorId,
                    'title' => $row['title'],
                    'slug' => $row['slug'],
                    'body' => $row['content'],
                    'locale' => 'fr',
                    'status' => $row['status'],
                    'published_at' => $row['published_at'] !== 'NULL' ? $row['published_at'] : null,
                    'created_at' => $row['created_at'] !== 'NULL' ? $row['created_at'] : now(),
                    'updated_at' => $row['updated_at'] !== 'NULL' ? $row['updated_at'] : now(),
                ]);
                $this->articleIdMap[(int) $row['id']] = $article->id;
            }

            $imported++;
        }

        $this->line("Articles: {$imported} imported, {$skipped} skipped (already exist).");
    }

    private function importEvents(bool $dryRun): void
    {
        $rows = $this->parseDumpTable('events');
        $skipped = 0;
        $imported = 0;

        foreach ($rows as $row) {
            $slug = Str::slug($row['name']);

            if (Event::where('slug', $slug)->exists()) {
                $existing = Event::where('slug', $slug)->first();
                $this->eventIdMap[(int) $row['id']] = $existing->id;
                $skipped++;

                continue;
            }

            $description = $row['description'];
            if ($row['place'] !== 'NULL' && $row['place'] !== '') {
                $description = "📍 {$row['place']}\n\n{$description}";
            }

            $onlineUrl = ($row['rsvp_link'] !== 'NULL' && $row['rsvp_link'] !== '') ? $row['rsvp_link'] : null;
            $replayUrl = ($row['event_link'] !== 'NULL' && $row['event_link'] !== '') ? $row['event_link'] : null;

            if (! $dryRun) {
                $event = Event::create([
                    'title' => $row['name'],
                    'slug' => $slug,
                    'format' => 'meetup',
                    'description' => $description,
                    'starts_at' => $row['date'],
                    'is_online' => false,
                    'online_url' => $onlineUrl,
                    'replay_url' => $replayUrl,
                    'status' => $row['is_published'] === '1' ? 'published' : 'draft',
                    'created_at' => $row['created_at'] !== 'NULL' ? $row['created_at'] : now(),
                    'updated_at' => $row['updated_at'] !== 'NULL' ? $row['updated_at'] : now(),
                ]);
                $this->eventIdMap[(int) $row['id']] = $event->id;
            }

            $imported++;
        }

        $this->line("Events: {$imported} imported, {$skipped} skipped (already exist).");
    }

    private function importMedia(bool $dryRun): void
    {
        $rows = $this->parseDumpTable('media');
        $skipped = 0;
        $imported = 0;

        foreach ($rows as $row) {
            if ($row['uuid'] !== 'NULL' && DB::table('media')->where('uuid', $row['uuid'])->exists()) {
                $skipped++;

                continue;
            }

            $modelType = $row['model_type'];
            $modelId = (int) $row['model_id'];

            if ($modelType === Article::class) {
                if (! isset($this->articleIdMap[$modelId])) {
                    $skipped++;

                    continue;
                }
                $modelId = $this->articleIdMap[$modelId];
            } elseif ($modelType === Event::class) {
                if (! isset($this->eventIdMap[$modelId])) {
                    $skipped++;

                    continue;
                }
                $modelId = $this->eventIdMap[$modelId];
            } else {
                // Skip media for models not migrated (e.g. Project)
                $skipped++;

                continue;
            }

            if (! $dryRun) {
                DB::table('media')->insert([
                    'model_type' => $modelType,
                    'model_id' => $modelId,
                    'uuid' => $row['uuid'] !== 'NULL' ? $row['uuid'] : null,
                    'collection_name' => $row['collection_name'],
                    'name' => $row['name'],
                    'file_name' => $row['file_name'],
                    'mime_type' => $row['mime_type'] !== 'NULL' ? $row['mime_type'] : null,
                    'disk' => $row['disk'],
                    'conversions_disk' => $row['conversions_disk'] !== 'NULL' ? $row['conversions_disk'] : null,
                    'size' => (int) $row['size'],
                    'manipulations' => $row['manipulations'],
                    'custom_properties' => $row['custom_properties'],
                    'generated_conversions' => $row['generated_conversions'],
                    'responsive_images' => $row['responsive_images'],
                    'order_column' => $row['order_column'] !== 'NULL' ? (int) $row['order_column'] : null,
                    'created_at' => $row['created_at'] !== 'NULL' ? $row['created_at'] : null,
                    'updated_at' => $row['updated_at'] !== 'NULL' ? $row['updated_at'] : null,
                ]);
            }

            $imported++;
        }

        $this->line("Media: {$imported} imported, {$skipped} skipped.");
    }

    private function importTaggables(bool $dryRun): void
    {
        $rows = $this->parseDumpTable('taggables');
        $skipped = 0;
        $imported = 0;

        foreach ($rows as $row) {
            $oldTagId = (int) $row['tag_id'];
            $taggableType = $row['taggable_type'];
            $oldTaggableId = (int) $row['taggable_id'];

            // Only migrate Article taggables (Project model not in new app)
            if ($taggableType !== Article::class) {
                continue;
            }

            if (! isset($this->tagIdMap[$oldTagId]) || ! isset($this->articleIdMap[$oldTaggableId])) {
                $skipped++;

                continue;
            }

            $newTagId = $this->tagIdMap[$oldTagId];
            $newTaggableId = $this->articleIdMap[$oldTaggableId];

            $exists = DB::table('taggables')
                ->where('tag_id', $newTagId)
                ->where('taggable_type', $taggableType)
                ->where('taggable_id', $newTaggableId)
                ->exists();

            if ($exists) {
                $skipped++;

                continue;
            }

            if (! $dryRun) {
                DB::table('taggables')->insert([
                    'tag_id' => $newTagId,
                    'taggable_type' => $taggableType,
                    'taggable_id' => $newTaggableId,
                ]);
            }

            $imported++;
        }

        $this->line("Taggables (articles only): {$imported} imported, {$skipped} skipped.");
    }

    /**
     * Parse INSERT statements for a given table from the SQL dump.
     * Handles both positional (VALUES without column list) and named column formats.
     *
     * @return array<int, array<string, string>>
     */
    private function parseDumpTable(string $table): array
    {
        // Extract column names from CREATE TABLE statement
        $createPattern = '/CREATE TABLE `'.preg_quote($table, '/').'` \(([\s\S]+?)\) ENGINE=/';

        if (! preg_match($createPattern, $this->sql, $createMatches)) {
            $this->warn("No CREATE TABLE found for table: {$table}");

            return [];
        }

        preg_match_all('/^\s+`([^`]+)`/m', $createMatches[1], $colMatches);
        $columns = $colMatches[1];

        // Find INSERT ... VALUES block (positional or named)
        $insertPattern = '/INSERT INTO `'.preg_quote($table, '/').'`(?:\s*\([^)]+\))?\s*VALUES\s*([\s\S]+?);(?:\n|$)/';

        if (! preg_match($insertPattern, $this->sql, $insertMatches)) {
            $this->warn("No INSERT data found for table: {$table}");

            return [];
        }

        $valuesBlock = $insertMatches[1];
        $rows = $this->extractValueTuples($valuesBlock);

        $result = [];

        foreach ($rows as $row) {
            $values = $this->parseValueRow($row);

            if (count($values) !== count($columns)) {
                continue;
            }

            $result[] = array_combine($columns, $values);
        }

        return $result;
    }

    /**
     * Extract individual value tuples from a VALUES block.
     *
     * @return array<string>
     */
    private function extractValueTuples(string $valuesBlock): array
    {
        $tuples = [];
        $depth = 0;
        $inString = false;
        $escape = false;
        $start = null;

        for ($i = 0; $i < strlen($valuesBlock); $i++) {
            $char = $valuesBlock[$i];

            if ($escape) {
                $escape = false;

                continue;
            }

            if ($char === '\\' && $inString) {
                $escape = true;

                continue;
            }

            if ($char === "'") {
                $inString = ! $inString;

                continue;
            }

            if ($inString) {
                continue;
            }

            if ($char === '(') {
                if ($depth === 0) {
                    $start = $i + 1;
                }
                $depth++;
            } elseif ($char === ')') {
                $depth--;
                if ($depth === 0 && $start !== null) {
                    $tuples[] = substr($valuesBlock, $start, $i - $start);
                    $start = null;
                }
            }
        }

        return $tuples;
    }

    /**
     * Parse a single value row string into an array of scalar values.
     *
     * @return array<string>
     */
    private function parseValueRow(string $row): array
    {
        $values = [];
        $inString = false;
        $escape = false;
        $current = '';

        for ($i = 0; $i < strlen($row); $i++) {
            $char = $row[$i];

            if ($escape) {
                $current .= $char;
                $escape = false;

                continue;
            }

            if ($char === '\\' && $inString) {
                $current .= $char;
                $escape = true;

                continue;
            }

            if ($char === "'" && ! $inString) {
                $inString = true;

                continue;
            }

            if ($char === "'") {
                $inString = false;

                continue;
            }

            if ($inString) {
                $current .= $char;

                continue;
            }

            if ($char === ',') {
                $values[] = trim($current) === 'NULL' ? 'NULL' : str_replace(['\\\\', '\\"', '\\n', '\\r', '\\t'], ['\\', '"', "\n", "\r", "\t"], $current);
                $current = '';

                continue;
            }

            $current .= $char;
        }

        $values[] = trim($current) === 'NULL' ? 'NULL' : str_replace(['\\\\', '\\"', '\\n', '\\r', '\\t'], ['\\', '"', "\n", "\r", "\t"], $current);

        return $values;
    }

    /**
     * Extract a locale string from a JSON column value.
     * Old app stored multilingual strings as {"fr":"...","en":"..."}.
     */
    private function extractJsonLocale(string $value, string $locale = 'fr'): string
    {
        $decoded = json_decode($value, true);

        if (is_array($decoded)) {
            return $decoded[$locale] ?? (string) reset($decoded);
        }

        return $value;
    }
}
