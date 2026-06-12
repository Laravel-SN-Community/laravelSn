<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('a 503 renders the standalone maintenance page', function (): void {
    Route::get('/force-maintenance', fn () => abort(503));

    $this->get('/force-maintenance')
        ->assertServiceUnavailable()
        ->assertInertia(fn (Assert $page): Assert => $page->component('maintenance'));
});

test('other error statuses keep the regular error page', function (): void {
    $this->get('/this-page-does-not-exist')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('error')
            ->where('status', 404)
            ->where('path', '/this-page-does-not-exist')
        );
});
