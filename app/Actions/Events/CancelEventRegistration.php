<?php

declare(strict_types=1);

namespace App\Actions\Events;

use App\Enums\EventRegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class CancelEventRegistration
{
    public function __invoke(Event $event, User $user): void
    {
        DB::transaction(function () use ($event, $user): void {
            $registration = EventRegistration::query()
                ->where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->whereNotIn('status', [
                    EventRegistrationStatus::Cancelled,
                    EventRegistrationStatus::Attended,
                    EventRegistrationStatus::NoShow,
                ])
                ->lockForUpdate()
                ->first();

            if ($registration === null) {
                return;
            }

            $wasConfirmed = $registration->status === EventRegistrationStatus::Confirmed;

            $registration->cancel();

            if ($wasConfirmed) {
                $this->promoteFromWaitlist($event);
            }
        });
    }

    private function promoteFromWaitlist(Event $event): void
    {
        $next = EventRegistration::query()
            ->where('event_id', $event->id)
            ->where('status', EventRegistrationStatus::Waitlisted)
            ->orderBy('registered_at')
            ->first();

        if ($next === null) {
            return;
        }

        $next->confirm();
    }
}
