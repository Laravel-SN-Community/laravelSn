<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AppearanceController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appearance' => ['required', Rule::in(['light', 'dark', 'system'])],
        ]);

        $user = $request->user();
        $user->settings = array_merge($user->settings ?? [], [
            'appearance' => $validated['appearance'],
        ]);
        $user->save();

        return response()->json(['appearance' => $validated['appearance']]);
    }
}
