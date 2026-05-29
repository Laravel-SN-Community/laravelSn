<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ReplyFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Override;

/**
 * @property-read int $id
 * @property int $thread_id
 * @property int $user_id
 * @property-read int|null $parent_id
 * @property-read string $body
 * @property-read bool $is_edited
 * @property-read Carbon|null $edited_at
 * @property-read bool $is_solution
 * @property-read Thread $thread
 * @property-read User $author
 * @property-read Reply|null $parent
 * @property-read Collection<int, Reply> $children
 */
final class Reply extends Model
{
    /** @use HasFactory<ReplyFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    #[Override]
    protected function casts(): array
    {
        return [
            'is_edited' => 'boolean',
            'edited_at' => 'datetime',
        ];
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(Thread::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    protected function isSolution(): Attribute
    {
        return Attribute::get(
            fn (): bool => $this->thread->solution_reply_id === $this->id
        );
    }

    public function markAsEdited(): void
    {
        $this->update([
            'is_edited' => true,
            'edited_at' => now(),
        ]);
    }
}
