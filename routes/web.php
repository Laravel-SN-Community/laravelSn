<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/articles', 'site/articles')->name('articles');
Route::get('/articles/{slug}', fn (string $slug) => inertia('site/article', ['slug' => $slug]))->name('article');

Route::inertia('/evenements', 'site/evenements')->name('evenements');
Route::get('/evenements/{slug}', fn (string $slug) => inertia('site/evenement', ['slug' => $slug]))->name('evenement');

Route::inertia('/forum', 'site/forum')->name('forum');
Route::get('/forum/{slug}', fn (string $slug) => inertia('site/forum-thread', ['slug' => $slug]))->name('forum.thread');

Route::inertia('/rejoindre', 'site/rejoindre')->name('rejoindre');

Route::inertia('/rules', 'site/rules')->name('rules');
Route::inertia('/terms', 'site/terms')->name('terms');
Route::inertia('/privacy', 'site/privacy')->name('privacy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
