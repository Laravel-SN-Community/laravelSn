<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class UserController extends Controller
{
    public function show(string $username): Response
    {
        $user = User::where('username', $username)->firstOrFail();

        $articles = Article::query()
            ->where('author_id', $user->id)
            ->published()
            ->with(['author:id,name,username,avatar', 'tags:id,name,slug'])
            ->latest('published_at')
            ->get()
            ->each->makeHidden(['body', 'seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

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
            ],
            'articles' => $articles,
        ]);
    }
}
