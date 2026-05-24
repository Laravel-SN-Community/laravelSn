<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ReactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property-read int $id
 * @property-read string $reactable_type
 * @property-read int $reactable_id
 * @property-read int $user_id
 * @property-read string $type
 * @property-read User $user
 */
final class Reaction extends Model
{
    /** @use HasFactory<ReactionFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $guarded = [];

    public function reactable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
