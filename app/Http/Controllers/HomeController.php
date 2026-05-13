<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

final class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $latestArticles = Article::query()
            ->published()
            ->with(['author:id,name,username,avatar', 'tags:id,name,slug'])
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->each->makeHidden(['body', 'seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'latestArticles' => $latestArticles,
        ]);
    }
}
