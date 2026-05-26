<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PublicationStatus;
use Database\Factories\ArticleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property PublicationStatus $status
 * @property Carbon|null $published_at
 * @property Carbon|null $submitted_at
 * @property Carbon|null $approved_at
 * @property Carbon|null $declined_at
 * @property bool $is_featured
 * @property int $reading_time_minutes
 * @property int $views_count
 * @property int $likes_count
 * @property array<string, mixed>|null $seo_meta
 * @property string $excerpt
 */
#[Fillable([
    'author_id',
    'title',
    'slug',
    'body',
    'locale',
    'status',
    'published_at',
    'submitted_at',
    'approved_at',
    'declined_at',
    'reading_time_minutes',
    'is_featured',
    'seo_meta',
])]
final class Article extends Model implements HasMedia
{
    /** @use HasFactory<ArticleFactory> */
    use HasFactory;

    use InteractsWithMedia;
    use SoftDeletes;

    /** @var list<string> */
    protected $appends = ['excerpt', 'cover_url'];

    protected static function boot(): void
    {
        parent::boot();

        self::creating(function (self $article): void {
            if (empty($article->slug)) {
                $base = Str::slug($article->title);
                $slug = $base;
                $count = 1;

                while (static::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$count}";
                    $count++;
                }

                $article->slug = $slug;
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'declined_at' => 'datetime',
            'is_featured' => 'boolean',
            'reading_time_minutes' => 'integer',
            'views_count' => 'integer',
            'likes_count' => 'integer',
            'status' => PublicationStatus::class,
            'seo_meta' => 'array',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', PublicationStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    #[Scope]
    protected function featured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    #[Scope]
    protected function inLocale(Builder $query, string $locale): void
    {
        $query->where('locale', $locale);
    }

    #[Scope]
    protected function withTag(Builder $query, string $tagSlug): void
    {
        $query->whereHas('tags', fn (Builder $q) => $q->where('slug', $tagSlug));
    }

    protected function excerpt(): Attribute
    {
        return Attribute::get(function (): string {
            $text = preg_replace('/```[\s\S]*?```/', '', $this->body ?? '');
            $text = preg_replace('/[#*`\[\]_>~]/', '', $text ?? '');
            $text = trim(preg_replace('/\s+/', ' ', $text ?? ''));

            return mb_strlen($text) > 200 ? mb_substr($text, 0, 200).'…' : $text;
        });
    }

    protected function coverUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            $url = $this->getCoverImageUrl();

            return $url !== '' ? $url : null;
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('media')
            ->singleFile()
            ->acceptsMimeTypes([
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/avif',
            ]);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->performOnCollections('media')
            ->format('webp')
            ->quality(85);
    }

    public function getCoverImageUrl(): string
    {
        $media = $this->getFirstMedia('media');

        if (! $media instanceof Media) {
            return '';
        }

        if ($media->hasGeneratedConversion('webp')) {
            return $media->getUrl('webp');
        }

        return $media->getUrl();
    }

    protected function url(): Attribute
    {
        return Attribute::get(fn (): string => route('article', $this->slug));
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function isPublished(): bool
    {
        return $this->status === PublicationStatus::Published
            && $this->published_at !== null
            && $this->published_at->isPast();
    }
}
