<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Events\CancelEventRegistration;
use App\Actions\Events\RegisterUserToEvent;
use App\Enums\EventRegistrationStatus;
use App\Models\Event;
use App\Support\Exceptions\EventRegistrationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->string('tab', 'upcoming')->toString();

        $events = Event::query()
            ->published()
            ->when(
                $tab === 'past',
                fn ($q) => $q->past(),
                fn ($q) => $q->upcoming()
            )
            ->with(['venue:id,name,district', 'speakers'])
            ->withCount(['registrations as confirmed_count' => function ($query): void {
                $query->where('status', EventRegistrationStatus::Confirmed);
            }])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => [
                'tab' => $tab,
            ],
        ]);
    }

    public function show(Event $event): Response
    {
        abort_unless($event->status->isVisible(), 404);

        $event->load(['venue', 'speakers']);

        $userRegistration = null;
        $user = auth()->user();

        if ($user !== null) {
            $userRegistration = $event->registrations()
                ->where('user_id', $user->id)
                ->first();
        }

        return Inertia::render('events/show', [
            'event' => $event,
            'userRegistration' => $userRegistration,
            'similarEvents' => Event::query()
                ->published()
                ->upcoming()
                ->where('id', '!=', $event->id)
                ->where('format', $event->format)
                ->with('venue:id,name,district')
                ->limit(3)
                ->get(),
        ]);
    }

    public function register(Request $request, Event $event, RegisterUserToEvent $action): RedirectResponse
    {
        Gate::authorize('register', $event);

        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $registration = ($action)($event, $request->user(), $validated['notes'] ?? null);

            return back()->with('success', match ($registration->status) {
                EventRegistrationStatus::Confirmed => 'Inscription confirmée !',
                EventRegistrationStatus::Waitlisted => 'Tu es sur la liste d\'attente.',
                default => 'Inscription enregistrée.',
            });
        } catch (EventRegistrationException $e) {
            return back()->withErrors(['registration' => $e->getMessage()]);
        }
    }

    public function unregister(Request $request, Event $event, CancelEventRegistration $action): RedirectResponse
    {
        ($action)($event, $request->user());

        return back()->with('success', 'Inscription annulée.');
    }
}
