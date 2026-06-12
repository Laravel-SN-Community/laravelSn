<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

/*
 * Two routes registered for the same URI and method behave differently with
 * and without route caching: uncached, the later registration wins; cached
 * (production), the FIRST one wins. This silently broke POST /forum/threads
 * and POST/DELETE /settings/profile, because Route::redirect() answers every
 * HTTP method. This test fails on any such collision.
 */
test('no two routes share the same uri and method', function (): void {
    $seen = [];
    $collisions = [];

    foreach (Route::getRoutes() as $route) {
        foreach ($route->methods() as $method) {
            if ($method === 'HEAD') {
                continue;
            }

            $key = $method.' /'.ltrim((string) $route->uri(), '/');

            if (isset($seen[$key])) {
                $collisions[] = "{$key} → [{$seen[$key]}] vs [{$route->getActionName()}]";
            }

            $seen[$key] = $route->getActionName();
        }
    }

    expect($collisions)->toBe([]);
});
