<?php

declare(strict_types=1);

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/articles', [ArticleController::class, 'index'])->name('articles');
Route::get('/articles/{article}', [ArticleController::class, 'show'])->name('article');

Route::inertia('/evenements', 'evenements/index')->name('evenements');
Route::get('/evenements/{slug}', fn (string $slug) => inertia('evenements/show', ['slug' => $slug]))->name('evenement');

Route::inertia('/forum', 'forum/index')->name('forum');
Route::get('/forum/{slug}', fn (string $slug) => inertia('forum/show', ['slug' => $slug]))->name('forum.thread');

Route::get('/@{username}', [UserController::class, 'show'])->name('profile');

Route::inertia('/ressources', 'ressources/index')->name('ressources');

Route::inertia('/rejoindre', 'rejoindre')->name('rejoindre');
Route::inertia('/rules', 'rules')->name('rules');
Route::inertia('/terms', 'terms')->name('terms');
Route::inertia('/privacy', 'privacy')->name('privacy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'dashboard/index')->name('dashboard');
    Route::get('/dashboard/articles', [ArticleController::class, 'dashboardIndex'])->name('dashboard.articles');
    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::inertia('/dashboard/events', 'dashboard/events')->name('dashboard.events');
    Route::inertia('/dashboard/notifications', 'dashboard/notifications')->name('dashboard.notifications');
});

require __DIR__.'/settings.php';
