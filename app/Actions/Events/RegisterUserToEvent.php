<?php

declare(strict_types=1);

namespace App\Actions\Events;

use App\Enums\EventRegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use App\Support\Exceptions\EventRegistrationException;
use Illuminate\Support\Facades\DB;

final readonly class RegisterUserToEvent
{
    public function __invoke(Event $event, User $user, ?string $notes = null): EventRegistration
    {
        return DB::transaction(function () use ($event, $user, $notes): EventRegistration {
            $event = Event::query()->lockForUpdate()->find($event->id);

            $this->validateRegistration($event, $user);

            $existing = EventRegistration::query()
                ->where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing !== null) {
                if ($existing->status === EventRegistrationStatus::Cancelled) {
                    return $this->reactivate($existing, $event);
                }

                throw EventRegistrationException::alreadyRegistered();
            }

            return $this->createRegistration($event, $user, $notes);
        });
    }

    private function validateRegistration(Event $event, User $user): void
    {
        if (! $event->status->isVisible()) {
            throw EventRegistrationException::eventNotPublished();
        }

        if (! $event->registrations_open) {
            throw EventRegistrationException::registrationsClosed();
        }
    }

    private function createRegistration(Event $event, User $user, ?string $notes): EventRegistration
    {
        $confirmedCount = $event->confirmedRegistrations()->count();
        $hasCapacity = $event->capacity === null || $confirmedCount < $event->capacity;

        $status = $hasCapacity
            ? EventRegistrationStatus::Confirmed
            : EventRegistrationStatus::Waitlisted;

        if ($status === EventRegistrationStatus::Waitlisted && $event->waitlist_capacity > 0) {
            $waitlistCount = EventRegistration::query()
                ->where('event_id', $event->id)
                ->where('status', EventRegistrationStatus::Waitlisted)
                ->count();

            if ($waitlistCount >= $event->waitlist_capacity) {
                throw EventRegistrationException::waitlistFull();
            }
        }

        return EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => $status,
            'notes' => $notes,
            'registered_at' => now(),
            'confirmed_at' => $status === EventRegistrationStatus::Confirmed ? now() : null,
        ]);
    }

    private function reactivate(EventRegistration $registration, Event $event): EventRegistration
    {
        $confirmedCount = $event->confirmedRegistrations()->count();
        $hasCapacity = $event->capacity === null || $confirmedCount < $event->capacity;

        $registration->update([
            'status' => $hasCapacity
                ? EventRegistrationStatus::Confirmed
                : EventRegistrationStatus::Waitlisted,
            'cancelled_at' => null,
            'confirmed_at' => $hasCapacity ? now() : null,
        ]);

        return $registration->refresh();
    }
}
