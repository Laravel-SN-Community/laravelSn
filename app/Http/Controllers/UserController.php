<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class UserController extends Controller
{
    public function manageIndex(Request $request): Response
    {
        Gate::authorize('users:manage');

        $users = User::query()
            ->with('roles:name')
            ->latest()
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('dashboard/manage/users', [
            'users' => $users,
        ]);
    }

    public function show(string $username): Response
    {
        $user = User::where('username', $username)->with(['media', 'roles:name'])->firstOrFail();

        $articles = Article::query()
            ->where('author_id', $user->id)
            ->published()
            ->with(['author:id,name,username', 'author.media', 'tags:id,name,slug'])
            ->latest('published_at')
            ->get()
            ->each->makeHidden(['body', 'seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

        $threads = Thread::query()
            ->where('user_id', $user->id)
            ->with('channels:id,name,slug,color')
            ->latest()
            ->get(['id', 'slug', 'title', 'replies_count', 'created_at', 'solution_reply_id']);

        $replies = Reply::query()
            ->where('user_id', $user->id)
            ->with(['thread:id,slug,title'])
            ->latest()
            ->get(['id', 'thread_id', 'body', 'created_at']);

        $solutionThreadIds = $threads->whereNotNull('solution_reply_id')->pluck('id');
        $solutions = $solutionThreadIds->isNotEmpty()
            ? Reply::query()
                ->whereIn('thread_id', $solutionThreadIds)
                ->where('user_id', $user->id)
                ->whereIn('id', $threads->whereNotNull('solution_reply_id')->pluck('solution_reply_id'))
                ->with(['thread:id,slug,title'])
                ->latest()
                ->get(['id', 'thread_id', 'body', 'created_at'])
            : collect();

        $locale = (string) config('app.locale');

        $activity = collect()
            ->merge($articles->map(fn (Article $a): array => [
                'type' => 'article',
                'title' => $a->title,
                'url' => '/articles/'.$a->slug,
                'excerpt' => null,
                'date' => $a->published_at,
                'date_human' => $a->published_at?->locale($locale)->diffForHumans(),
            ]))
            ->merge($threads->map(fn (Thread $t): array => [
                'type' => 'thread',
                'title' => $t->title,
                'url' => '/forum/threads/'.$t->slug,
                'excerpt' => null,
                'date' => $t->created_at->toISOString(),
                'date_human' => $t->created_at->locale($locale)->diffForHumans(),
            ]))
            ->merge($replies->map(fn (Reply $r): array => [
                'type' => 'reply',
                'title' => $r->thread->title,
                'url' => '/forum/threads/'.$r->thread->slug.'#reply-'.$r->id,
                'excerpt' => str($r->body)->limit(200)->toString(),
                'date' => $r->created_at->toISOString(),
                'date_human' => $r->created_at->locale($locale)->diffForHumans(),
            ]))
            ->sortByDesc('date')
            ->values();

        $role = $user->getRoleNames()->first();

        return Inertia::render('membres/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'location' => $user->location,
                'github_handle' => $user->github_handle,
                'twitter_handle' => $user->twitter_handle,
                'website_url' => $user->website_url,
                'created_at' => $user->created_at,
                'role' => $role,
            ],
            'articles' => $articles,
            'threads' => $threads,
            'replies' => $replies,
            'solutions' => $solutions,
            'activity' => $activity,
        ]);
    }
}
