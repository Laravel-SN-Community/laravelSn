<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\TagFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

#[Fillable(['name', 'slug', 'description'])]
final class Tag extends Model
{
    /** @use HasFactory<TagFactory> */
    use HasFactory;

    protected static function boot(): void
    {
        parent::boot();

        self::creating(function (self $tag): void {
            if (empty($tag->slug)) {
                $base = Str::slug($tag->name);
                $slug = $base;
                $count = 1;

                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$count}";
                    $count++;
                }

                $tag->slug = $slug;
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'articles_count' => 'integer',
            'resources_count' => 'integer',
        ];
    }

    public function articles(): MorphToMany
    {
        return $this->morphedByMany(Article::class, 'taggable');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
