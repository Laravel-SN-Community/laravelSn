<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', ['canRegister' => Features::enabled(Features::registration())])->name('home');

Route::inertia('/articles', 'articles/index')->name('articles');
Route::get('/articles/{slug}', fn (string $slug) => inertia('articles/show', ['slug' => $slug]))->name('article');

Route::inertia('/evenements', 'evenements/index')->name('evenements');
Route::get('/evenements/{slug}', fn (string $slug) => inertia('evenements/show', ['slug' => $slug]))->name('evenement');

Route::inertia('/forum', 'forum/index')->name('forum');
Route::get('/forum/{slug}', fn (string $slug) => inertia('forum/show', ['slug' => $slug]))->name('forum.thread');

Route::inertia('/membres', 'membres/index')->name('membres');
Route::get('/membres/{slug}', fn (string $slug) => inertia('membres/show', ['slug' => $slug]))->name('membre');

Route::inertia('/ressources', 'ressources/index')->name('ressources');

Route::inertia('/rejoindre', 'rejoindre')->name('rejoindre');
Route::inertia('/rules', 'rules')->name('rules');
Route::inertia('/terms', 'terms')->name('terms');
Route::inertia('/privacy', 'privacy')->name('privacy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'dashboard/index')->name('dashboard');
    Route::inertia('/dashboard/articles', 'dashboard/articles')->name('dashboard.articles');
    Route::inertia('/dashboard/events', 'dashboard/events')->name('dashboard.events');
    Route::inertia('/dashboard/notifications', 'dashboard/notifications')->name('dashboard.notifications');
});

require __DIR__.'/settings.php';
