<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Routing\RedirectController;
use Illuminate\Support\Facades\Route;

// Redirects from old settings URLs. GET-only on purpose: Route::redirect()
// answers every HTTP method and, with cached routes, would shadow the
// POST/DELETE routes below that share these URIs.
foreach ([
    'settings' => '/dashboard/profile',
    'settings/profile' => '/dashboard/profile',
    'settings/security' => '/dashboard/settings',
    'settings/appearance' => '/dashboard/settings',
] as $from => $to) {
    Route::get($from, RedirectController::class)
        ->defaults('destination', $to)
        ->defaults('status', 302);
}

Route::middleware(['auth'])->group(function (): void {
    Route::get('dashboard/profile', [ProfileController::class, 'edit'])->name('dashboard.profile');
    Route::post('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth'])->group(function (): void {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('dashboard/settings', [SecurityController::class, 'edit'])->name('dashboard.settings');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::patch('dashboard/settings/appearance', [AppearanceController::class, 'update'])->name('settings.appearance.update');
});
