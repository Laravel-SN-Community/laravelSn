<?php

declare(strict_types=1);

namespace App\Http\Controllers\Forum;

use App\Http\Controllers\Controller;
use App\Models\Channel;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

final class ChannelController extends Controller
{
    public function channels(): Response
    {
        $channels = Channel::query()
            ->active()
            ->roots()
            ->with(['children' => fn ($q) => $q->active()])
            ->withCount('threads')
            ->addSelect(['*', DB::raw('(
                SELECT COALESCE(SUM(t.replies_count), 0)
                FROM threads t
                INNER JOIN channel_thread ct ON ct.thread_id = t.id
                WHERE ct.channel_id = channels.id
            ) as total_replies')])
            ->get();

        $totals = [
            'threads' => $channels->sum('threads_count'),
            'replies' => $channels->sum('total_replies'),
        ];

        return Inertia::render('forum/channels', [
            'channels' => $channels,
            'totals' => $totals,
        ]);
    }

    public function index(Request $request): Response
    {
        $channels = Channel::query()
            ->active()
            ->roots()
            ->with(['children' => fn ($q) => $q->active()])
            ->withCount('threads')
            ->get();

        $filter = $request->query('filter');
        $locale = $request->string('locale', 'fr')->toString();

        return Inertia::render('forum/index', [
            'channels' => $channels,
            'filter' => $filter,
            'locale' => $locale,
            'threads' => Inertia::scroll(fn () => Thread::query()
                ->with(['author:id,name,username', 'author.media', 'channels:id,name,slug,color'])
                ->inLocale($locale)
                ->when($filter === 'mine' && auth()->check(), fn ($q) => $q->where('user_id', auth()->id()))
                ->when($filter === 'subscribed' && auth()->check(), fn ($q) => $q->whereHas(
                    'subscribers', fn ($q) => $q->where('user_id', auth()->id()),
                ))
                ->when($filter === 'resolved', fn ($q) => $q->resolved())
                ->when($filter === 'unresolved', fn ($q) => $q->unresolved())
                ->when($filter === 'unanswered', fn ($q) => $q->where('replies_count', 0))
                ->when(
                    $filter === 'popular',
                    fn ($q) => $q->orderByDesc('views_count'),
                    fn ($q) => $q->orderedByActivity(),
                )
                ->paginate(20)
                ->withQueryString()
            ),
        ]);
    }

    public function show(Channel $channel): Response
    {
        $channel->load(['children' => fn ($q) => $q->active()]);

        $channels = Channel::query()
            ->active()
            ->roots()
            ->with(['children' => fn ($q) => $q->active()])
            ->get();

        $threads = Thread::query()
            ->inChannel($channel->slug)
            ->with(['author:id,name,username', 'author.media', 'channels:id,name,slug,color'])
            ->orderedByActivity()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('forum/channel', [
            'channel' => $channel,
            'channels' => $channels,
            'threads' => $threads,
        ]);
    }
}
