<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Reply;
use App\Models\User;

final class ReplyPolicy
{
    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Reply $reply): bool
    {
        return $user->id === $reply->user_id;
    }

    public function delete(User $user, Reply $reply): bool
    {
        return $user->id === $reply->user_id;
    }
}
