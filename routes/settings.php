<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

// Redirects from old settings URLs
Route::redirect('settings', '/dashboard/profile');
Route::redirect('settings/profile', '/dashboard/profile');
Route::redirect('settings/security', '/dashboard/settings');
Route::redirect('settings/appearance', '/dashboard/settings');

Route::middleware(['auth'])->group(function (): void {
    Route::get('dashboard/profile', [ProfileController::class, 'edit'])->name('dashboard.profile');
    Route::post('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('dashboard/settings', [SecurityController::class, 'edit'])->name('dashboard.settings');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
    Route::patch('dashboard/settings/appearance', [AppearanceController::class, 'update'])->name('settings.appearance.update');
});
