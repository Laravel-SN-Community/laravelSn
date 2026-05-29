<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

final class ArticlePolicy
{
    public function viewAny(): bool
    {
        return true;
    }

    public function view(?User $user, Article $article): bool
    {
        if ($article->isPublished()) {
            return true;
        }

        if (! $user instanceof User) {
            return false;
        }

        return $user->isAdmin() || $user->id === $article->author_id;
    }

    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Article $article): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $article->author_id;
    }

    public function delete(User $user, Article $article): bool
    {
        return $this->update($user, $article);
    }

    public function publish(User $user, Article $article): bool
    {
        return $this->update($user, $article);
    }

    public function restore(User $user): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user): bool
    {
        return $user->isAdmin();
    }
}
