<?php

declare(strict_types=1);

namespace App\Http\Controllers\Forum;

use App\Actions\Forum\PostReply;
use App\Http\Controllers\Controller;
use App\Models\Reply;
use App\Models\Thread;
use App\Support\Exceptions\ForumException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

final class ReplyController extends Controller
{
    public function store(Request $request, Thread $thread, PostReply $postReply): RedirectResponse
    {
        Gate::authorize('create', Reply::class);

        $data = $request->validate([
            'body' => ['required', 'string', 'min:10'],
            'parent_id' => ['nullable', 'integer', 'exists:replies,id'],
        ]);

        $parent = isset($data['parent_id'])
            ? Reply::find($data['parent_id'])
            : null;

        try {
            $postReply($thread, $request->user(), $data['body'], $parent);
        } catch (ForumException $e) {
            return back()->withErrors(['body' => $e->getMessage()]);
        }

        return back()->with('success', 'Réponse publiée.');
    }

    public function update(Request $request, Reply $reply): RedirectResponse
    {
        Gate::authorize('update', $reply);

        $data = $request->validate([
            'body' => ['required', 'string', 'min:10'],
        ]);

        $reply->update(['body' => $data['body']]);
        $reply->markAsEdited();

        return back()->with('success', 'Réponse modifiée.');
    }

    public function destroy(Request $request, Reply $reply): RedirectResponse
    {
        abort_unless($request->user()->id === $reply->user_id, 403);

        $reply->thread->decrement('replies_count');
        $reply->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Réponse supprimée.']);

        return back();
    }
}
