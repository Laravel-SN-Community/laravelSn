<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

final class EventPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Event $event): bool
    {
        if ($event->status->isVisible()) {
            return true;
        }

        if ($user === null) {
            return false;
        }

        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }

    public function register(User $user, Event $event): bool
    {
        return $event->status->isVisible() && $event->registrations_open;
    }

    public function manageRegistrations(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }
}
