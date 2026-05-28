<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->string('q')->trim()->toString();
        $scope = $request->string('scope')->toString();

        if ($query === '') {
            return response()->json([
                'articles' => [],
                'threads' => [],
                'members' => [],
            ]);
        }

        $articles = [];
        $threads = [];
        $members = [];

        if ($scope === '' || $scope === 'articles') {
            $articles = Article::search($query)->take(5)->get()
                ->map(fn (Article $article) => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'author' => $article->author->name,
                    'url' => route('article', $article->slug),
                ])->all();
        }

        if ($scope === '' || $scope === 'threads') {
            $threads = Thread::search($query)->take(5)->get()
                ->map(fn (Thread $thread) => [
                    'id' => $thread->id,
                    'title' => $thread->title,
                    'author' => $thread->author->name,
                    'url' => route('forum.threads.show', $thread->slug),
                ])->all();
        }

        if ($scope === '' || $scope === 'members') {
            $members = User::search($query)->take(5)->get()
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar' => $user->avatar,
                    'url' => route('profile', $user->username),
                ])->all();
        }

        return response()->json(compact('articles', 'threads', 'members'));
    }
}
