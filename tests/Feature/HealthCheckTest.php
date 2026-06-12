<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// ── health endpoint ────────────────────────────────────────────────────────

test('the health check endpoint responds', function (): void {
    $this->get('/up')->assertOk();
});

// ── reverse proxy support ──────────────────────────────────────────────────

test('forwarded proto headers from the reverse proxy are trusted', function (): void {
    Route::get('/proxy-check', fn () => response()->json([
        'secure' => request()->isSecure(),
    ]));

    $this->withHeaders(['X-Forwarded-Proto' => 'https'])
        ->get('/proxy-check')
        ->assertOk()
        ->assertJson(['secure' => true]);
});
