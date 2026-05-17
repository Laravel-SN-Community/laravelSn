<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

final class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $latestArticles = Article::query()
            ->published()
            ->with(['author:id,name,username,avatar', 'tags:id,name,slug'])
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->each->makeHidden(['body', 'seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

        $featured = Event::query()
            ->published()
            ->upcoming()
            ->featured()
            ->with('venue:id,name,district')
            ->withCount('confirmedRegistrations')
            ->orderBy('starts_at')
            ->limit(1)
            ->get();

        $others = Event::query()
            ->published()
            ->upcoming()
            ->whereNotIn('id', $featured->pluck('id'))
            ->with('venue:id,name,district')
            ->withCount('confirmedRegistrations')
            ->orderBy('starts_at')
            ->limit(3 - $featured->count())
            ->get();

        $upcomingEvents = $featured->concat($others)
            ->makeHidden(['seo_meta', 'agenda', 'description', 'cover_path', 'online_url', 'replay_url']);

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'latestArticles' => $latestArticles,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
