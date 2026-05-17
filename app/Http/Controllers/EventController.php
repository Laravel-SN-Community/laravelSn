<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Events\CancelEventRegistration;
use App\Actions\Events\CreateEvent;
use App\Actions\Events\RegisterUserToEvent;
use App\Actions\Events\UpdateEvent;
use App\Enums\EventFormat;
use App\Enums\EventRegistrationStatus;
use App\Enums\PublicationStatus;
use App\Models\Event;
use App\Models\Venue;
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

    public function manageIndex(Request $request): Response
    {
        Gate::authorize('events:manage');

        $tab = $request->string('tab', 'all')->toString();

        $query = Event::query()
            ->with(['venue:id,name,district'])
            ->withCount('confirmedRegistrations');

        match ($tab) {
            'upcoming' => $query
                ->where('status', PublicationStatus::Published)
                ->where('starts_at', '>', now())
                ->orderBy('starts_at'),
            'drafts' => $query
                ->where('status', PublicationStatus::Draft)
                ->orderByDesc('starts_at'),
            'past' => $query
                ->where('status', PublicationStatus::Published)
                ->where('starts_at', '<', now())
                ->orderByDesc('starts_at'),
            default => $query->orderByDesc('starts_at'),
        };

        $events = $query->paginate(20)->withQueryString();

        $stats = [
            'total' => Event::query()->count(),
            'upcoming' => Event::query()
                ->where('status', PublicationStatus::Published)
                ->where('starts_at', '>', now())
                ->count(),
            'drafts' => Event::query()->where('status', PublicationStatus::Draft)->count(),
            'past' => Event::query()
                ->where('status', PublicationStatus::Published)
                ->where('starts_at', '<', now())
                ->count(),
        ];

        $venues = Venue::query()->orderBy('name')->get(['id', 'name', 'district']);

        return Inertia::render('dashboard/manage/events', [
            'events' => $events,
            'stats' => $stats,
            'venues' => $venues,
            'filters' => ['tab' => $tab],
        ]);
    }

    public function store(Request $request, CreateEvent $createEvent): RedirectResponse
    {
        Gate::authorize('events:manage');

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'format' => ['required', 'string', 'in:'.implode(',', array_column(EventFormat::cases(), 'value'))],
            'description' => ['required', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date'],
            'registration_opens_at' => ['nullable', 'date'],
            'registration_closes_at' => ['nullable', 'date'],
            'is_online' => ['boolean'],
            'venue_id' => ['nullable', 'integer', 'exists:venues,id'],
            'online_url' => ['nullable', 'url'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'waitlist_capacity' => ['integer', 'min:0'],
            'agenda' => ['nullable', 'array'],
            'agenda.*.time' => ['required', 'string', 'max:10'],
            'agenda.*.title' => ['required', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'is_sponsored' => ['boolean'],
            'replay_url' => ['nullable', 'url'],
            'publish' => ['boolean'],
        ]);

        $createEvent($data);

        return redirect()->route('manage.events.index');
    }

    public function update(Request $request, Event $event, UpdateEvent $updateEvent): RedirectResponse
    {
        Gate::authorize('events:manage');

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'format' => ['required', 'string', 'in:'.implode(',', array_column(EventFormat::cases(), 'value'))],
            'description' => ['required', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date'],
            'registration_opens_at' => ['nullable', 'date'],
            'registration_closes_at' => ['nullable', 'date'],
            'is_online' => ['boolean'],
            'venue_id' => ['nullable', 'integer', 'exists:venues,id'],
            'online_url' => ['nullable', 'url'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'waitlist_capacity' => ['integer', 'min:0'],
            'agenda' => ['nullable', 'array'],
            'agenda.*.time' => ['required', 'string', 'max:10'],
            'agenda.*.title' => ['required', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'is_sponsored' => ['boolean'],
            'replay_url' => ['nullable', 'url'],
            'publish' => ['boolean'],
        ]);

        $updateEvent($event, $data);

        return redirect()->route('manage.events.index');
    }

    public function destroy(Event $event): RedirectResponse
    {
        Gate::authorize('events:manage');

        $event->delete();

        return redirect()->route('manage.events.index');
    }
}
