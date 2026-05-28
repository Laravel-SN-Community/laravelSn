<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ThreadFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $solution_reply_id
 * @property int|null $resolved_by
 * @property string $title
 * @property string $slug
 * @property string $body
 * @property bool $is_locked
 * @property bool $is_pinned
 * @property int $replies_count
 * @property int $views_count
 * @property Carbon $last_posted_at
 * @property Carbon|null $resolved_at
 * @property-read bool $is_resolved
 * @property-read string $url
 * @property-read User $author
 * @property-read User|null $resolver
 * @property-read Reply|null $solution
 * @property-read Collection<int, Reply> $replies
 * @property-read Collection<int, Channel> $channels
 * @property-read Collection<int, User> $subscribers
 * @property-read Collection<int, Reaction> $reactions
 */
final class Thread extends Model
{
    /** @use HasFactory<ThreadFactory> */
    use HasFactory;

    use Searchable;
    use SoftDeletes;

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_locked' => 'boolean',
            'is_pinned' => 'boolean',
            'replies_count' => 'integer',
            'views_count' => 'integer',
            'last_posted_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        self::creating(function (self $thread): void {
            if (empty($thread->slug)) {
                $base = Str::slug($thread->title);
                $slug = $base;
                $count = 1;

                while (static::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$count}";
                    $count++;
                }

                $thread->slug = $slug;
            }
        });
    }

    /** @return BelongsTo<User, $this> */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function solution(): BelongsTo
    {
        return $this->belongsTo(Reply::class, 'solution_reply_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class)->whereNull('parent_id');
    }

    public function allReplies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }

    public function channels(): BelongsToMany
    {
        return $this->belongsToMany(Channel::class);
    }

    public function subscribers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'thread_subscriptions');
    }

    public function reactions(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }

    #[Scope]
    protected function inLocale(Builder $query, string $locale): void
    {
        $query->where('locale', $locale);
    }

    #[Scope]
    protected function pinned(Builder $query): void
    {
        $query->where('is_pinned', true);
    }

    #[Scope]
    protected function resolved(Builder $query): void
    {
        $query->whereNotNull('solution_reply_id');
    }

    #[Scope]
    protected function unresolved(Builder $query): void
    {
        $query->whereNull('solution_reply_id');
    }

    #[Scope]
    protected function inChannel(Builder $query, string $channelSlug): void
    {
        $query->whereHas('channels', fn (Builder $q) => $q->where('slug', $channelSlug));
    }

    #[Scope]
    protected function orderedByActivity(Builder $query): void
    {
        $query->orderByDesc('is_pinned')->orderByDesc('last_posted_at');
    }

    protected function isResolved(): Attribute
    {
        return Attribute::get(fn (): bool => $this->solution_reply_id !== null);
    }

    protected function url(): Attribute
    {
        return Attribute::get(fn (): string => route('forum.threads.show', $this->slug));
    }

    public function markAsResolved(Reply $reply, User $resolver): void
    {
        $this->update([
            'solution_reply_id' => $reply->id,
            'resolved_by' => $resolver->id,
            'resolved_at' => now(),
        ]);
    }

    public function unmarkAsResolved(): void
    {
        $this->update([
            'solution_reply_id' => null,
            'resolved_by' => null,
            'resolved_at' => null,
        ]);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing('author', 'channels');

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => $this->body,
            'author' => $this->author->name,
            'channels' => $this->channels->pluck('name')->all(),
            'is_solved' => $this->resolved_at !== null,
            'created_at' => $this->created_at->timestamp,
        ];
    }
}
