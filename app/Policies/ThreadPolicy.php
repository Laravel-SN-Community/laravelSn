<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Thread;
use App\Models\User;

final class ThreadPolicy
{
    public function viewAny(): bool
    {
        return true;
    }

    public function view(): bool
    {
        return true;
    }

    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id || $user->isAdmin();
    }

    public function delete(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id || $user->isAdmin();
    }

    public function markSolution(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id || $user->isModerator();
    }

    public function revokeSolution(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id || $user->isAdmin();
    }

    public function lock(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function pin(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
