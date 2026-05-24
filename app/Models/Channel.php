<?php

declare(strict_types=1);

namespace App\Models;

use App\Support\Exceptions\ForumException;
use Database\Factories\ChannelFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $parent_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $color
 * @property string|null $icon
 * @property int $threads_count
 * @property int $order
 * @property bool $is_active
 * @property-read Channel|null $parent
 * @property-read Collection<int, Channel> $children
 * @property-read Collection<int, Thread> $threads
 */
final class Channel extends Model
{
    /** @use HasFactory<ChannelFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'threads_count' => 'integer',
            'order' => 'integer',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        self::creating(function (self $channel): void {
            if (empty($channel->slug)) {
                $base = Str::slug($channel->name);
                $slug = $base;
                $count = 1;

                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$count}";
                    $count++;
                }

                $channel->slug = $slug;
            }
        });

        self::saving(function (self $channel): void {
            if (! $channel->parent_id) {
                return;
            }

            $parent = self::find($channel->parent_id);

            if ($parent && $parent->parent_id) {
                throw ForumException::channelCannotBeNestedDeeper();
            }
        });
    }

    /** @return BelongsTo<self, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /** @return HasMany<self, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function threads(): BelongsToMany
    {
        return $this->belongsToMany(Thread::class);
    }

    public function hasChildren(): bool
    {
        return $this->children->isNotEmpty();
    }

    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('is_active', true)->orderBy('order');
    }

    #[Scope]
    protected function roots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
