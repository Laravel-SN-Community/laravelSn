<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $dbAppearance = $user ? data_get($user->settings, 'appearance') : null;

        if ($dbAppearance) {
            View::share('appearance', $dbAppearance);
            View::share('syncAppearanceFromServer', true);
        } else {
            View::share('appearance', $request->cookie('appearance') ?? 'system');
            View::share('syncAppearanceFromServer', false);
        }

        return $next($request);
    }
}
