<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

final class ArticlePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Article $article): bool
    {
        if ($article->isPublished()) {
            return true;
        }

        if ($user === null) {
            return false;
        }

        return $user->isAdmin() || $user->id === $article->author_id;
    }

    public function create(User $user): bool
    {
        return $user->canPublishArticles();
    }

    public function update(User $user, Article $article): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->canPublishArticles() && $user->id === $article->author_id;
    }

    public function delete(User $user, Article $article): bool
    {
        return $this->update($user, $article);
    }

    public function publish(User $user, Article $article): bool
    {
        return $user->canPublishArticles();
    }

    public function restore(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }
}
