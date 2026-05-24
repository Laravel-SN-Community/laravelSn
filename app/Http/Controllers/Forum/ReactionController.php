<?php

declare(strict_types=1);

namespace App\Http\Controllers\Forum;

use App\Http\Controllers\Controller;
use App\Models\Thread;
use Database\Factories\ReactionFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class ReactionController extends Controller
{
    public function toggle(Request $request, Thread $thread): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'in:'.implode(',', ReactionFactory::TYPES)],
        ]);

        $existing = $thread->reactions()
            ->where('user_id', $request->user()->id)
            ->where('type', $data['type'])
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            $thread->reactions()->create([
                'user_id' => $request->user()->id,
                'type' => $data['type'],
            ]);
        }

        return back();
    }
}
