<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\EventRegistrationStatus;
use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Reaction;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard/index', [
            'stats' => $this->stats($user),
            'nextEvent' => $this->nextEvent(),
        ]);
    }

    /**
     * @return array{
     *     articlesPublished: int,
     *     articlesThisMonth: int,
     *     totalViews: int,
     *     eventsRegistered: int,
     *     upcomingEvents: int,
     *     reputation: int
     * }
     */
    private function stats(User $user): array
    {
        $publishedArticles = Article::query()
            ->where('author_id', $user->id)
            ->where('status', PublicationStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());

        $articlesPublished = (clone $publishedArticles)->count();

        $articlesThisMonth = (clone $publishedArticles)
            ->where('published_at', '>=', now()->startOfMonth())
            ->count();

        $totalViews = (int) (clone $publishedArticles)->sum('views_count');
        $articleLikes = (int) (clone $publishedArticles)->sum('likes_count');

        $registrations = EventRegistration::query()
            ->where('user_id', $user->id)
            ->whereNot('status', EventRegistrationStatus::Cancelled);

        $eventsRegistered = (clone $registrations)->count();

        $upcomingEvents = (clone $registrations)
            ->whereHas('event', fn ($query) => $query->where('starts_at', '>', now()))
            ->count();

        return [
            'articlesPublished' => $articlesPublished,
            'articlesThisMonth' => $articlesThisMonth,
            'totalViews' => $totalViews,
            'eventsRegistered' => $eventsRegistered,
            'upcomingEvents' => $upcomingEvents,
            'reputation' => $articleLikes + $this->forumReactionsReceived($user),
        ];
    }

    /**
     * Count reactions left by others on the threads and replies the user authored.
     */
    private function forumReactionsReceived(User $user): int
    {
        $threadReactions = Reaction::query()
            ->where('reactable_type', (new Thread)->getMorphClass())
            ->whereIn('reactable_id', Thread::query()->where('user_id', $user->id)->select('id'))
            ->count();

        $replyReactions = Reaction::query()
            ->where('reactable_type', (new Reply)->getMorphClass())
            ->whereIn('reactable_id', Reply::query()->where('user_id', $user->id)->select('id'))
            ->count();

        return $threadReactions + $replyReactions;
    }

    /**
     * @return array{
     *     title: string,
     *     slug: string,
     *     starts_at: string,
     *     is_online: bool,
     *     registrations_open: bool,
     *     is_full: bool,
     *     venue: array{name: string, district: string|null}|null
     * }|null
     */
    private function nextEvent(): ?array
    {
        $event = Event::query()
            ->published()
            ->upcoming()
            ->with('venue:id,name,district')
            ->first();

        if (! $event instanceof Event) {
            return null;
        }

        return [
            'title' => $event->title,
            'slug' => $event->slug,
            'starts_at' => $event->starts_at->toIso8601String(),
            'is_online' => $event->is_online,
            'registrations_open' => $event->registrations_open,
            'is_full' => $event->is_full,
            'venue' => $event->venue ? [
                'name' => $event->venue->name,
                'district' => $event->venue->district,
            ] : null,
        ];
    }
}
