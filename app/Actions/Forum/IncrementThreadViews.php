<?php

declare(strict_types=1);

namespace App\Actions\Forum;

use App\Models\Thread;
use Illuminate\Support\Facades\Cache;

final readonly class IncrementThreadViews
{
    public function __invoke(Thread $thread, string $ipAddress): void
    {
        $cacheKey = sprintf('thread-view:%d:%s', $thread->id, sha1($ipAddress));

        if (Cache::has($cacheKey)) {
            return;
        }

        Cache::put($cacheKey, true, now()->addHours(24));

        $thread->increment('views_count');
    }
}
