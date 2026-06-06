<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Articles\CreateArticle;
use App\Actions\Articles\DeclineArticle;
use App\Actions\Articles\DeleteArticle;
use App\Actions\Articles\IncrementArticleViews;
use App\Actions\Articles\PublishArticle;
use App\Actions\Articles\SubmitArticle;
use App\Actions\Articles\UpdateArticle;
use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $tagSlug = $request->string('tag')->toString();
        $locale = $request->string('locale', 'fr')->toString();
        $q = $request->string('q')->toString();
        $sort = $request->string('sort', 'recent')->toString();

        $articles = Article::query()
            ->published()
            ->inLocale($locale)
            ->when($tagSlug !== '', fn ($query) => $query->withTag($tagSlug))
            ->when($q !== '', fn ($query) => $query->where(
                fn ($sub) => $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('body', 'like', "%{$q}%")
            ))
            ->when($sort === 'popular', fn ($query) => $query->orderByDesc('views_count'))
            ->when($sort === 'long', fn ($query) => $query->orderByDesc('reading_time_minutes'))
            ->when($sort === 'short', fn ($query) => $query->orderBy('reading_time_minutes'))
            ->when(! in_array($sort, ['popular', 'long', 'short'], true), fn ($query) => $query->latest('published_at'))
            ->with(['author:id,name,username', 'author.media', 'tags:id,name,slug'])
            ->paginate(12)
            ->withQueryString();

        $articles->getCollection()->each->makeHidden(['body', 'seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

        return Inertia::render('articles/index', [
            'articles' => $articles,
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => [
                'tag' => $tagSlug ?: null,
                'locale' => $locale,
                'q' => $q ?: null,
                'sort' => $sort,
            ],
        ]);
    }

    public function show(Request $request, Article $article, IncrementArticleViews $incrementViews): Response
    {
        abort_unless(Gate::allows('view', $article), 404);

        ($incrementViews)($article, (string) $request->ip());

        $article->load(['author:id,name,username,bio,github_handle,location', 'author.media', 'tags:id,name,slug']);

        $relatedArticles = Article::query()
            ->published()
            ->where('id', '!=', $article->id)
            ->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $article->tags->pluck('id')))
            ->with(['author:id,name,username', 'author.media', 'tags:id,name,slug'])
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->each->makeHidden(['body', 'seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

        return Inertia::render('articles/show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ])->withViewData([
            'description' => $article->excerpt,
            'ogTitle' => $article->title,
            'ogImage' => $article->cover_url,
            'ogType' => 'article',
            'lcpImage' => $article->cover_srcset,
        ]);
    }

    public function dashboardIndex(Request $request): Response
    {
        $user = $request->user();

        $publishedArticles = Article::query()
            ->where('author_id', $user->id)
            ->where(function ($q): void {
                $q->where(function ($sub): void {
                    $sub->where('status', PublicationStatus::Published)
                        ->whereNotNull('published_at')
                        ->where('published_at', '<=', now());
                })
                    ->orWhere('status', PublicationStatus::Pending)
                    ->orWhere('status', PublicationStatus::Approved);
            })
            ->with(['tags:id,name,slug', 'media'])
            ->latest('updated_at')
            ->get()
            ->each->makeHidden(['seo_meta', 'submitted_at', 'approved_at', 'declined_at']);

        $draftArticles = Article::query()
            ->where('author_id', $user->id)
            ->whereIn('status', [PublicationStatus::Draft, PublicationStatus::Declined])
            ->with(['tags:id,name,slug', 'media'])
            ->latest('updated_at')
            ->get()
            ->each->makeHidden(['seo_meta']);

        return Inertia::render('dashboard/articles', [
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'publishedArticles' => $publishedArticles,
            'draftArticles' => $draftArticles,
            'canPublish' => Gate::allows('articles:publish'),
        ]);
    }

    public function store(Request $request, CreateArticle $createArticle): RedirectResponse
    {
        Gate::authorize('create', Article::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'locale' => ['required', 'string', 'in:fr,en'],
            'tags' => ['required', 'array', 'min:1', 'max:3'],
            'tags.*' => ['required', 'integer', 'exists:tags,id'],
            'is_draft' => ['boolean'],
            'published_at' => ['nullable', 'date', 'after_or_equal:today'],
            'cover' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp,avif'],
        ]);

        $isDraft = (bool) ($validated['is_draft'] ?? true);
        $canPublish = Gate::allows('articles:publish');
        $status = $isDraft
            ? PublicationStatus::Draft
            : ($canPublish ? PublicationStatus::Published : PublicationStatus::Pending);

        $article = $createArticle(
            author: $request->user(),
            data: [
                'title' => $validated['title'],
                'body' => $validated['body'],
                'locale' => $validated['locale'],
                'status' => $status,
                'published_at' => $isDraft
                    ? (null)
                    : $validated['published_at'] ?? ($canPublish ? now() : null),
                'submitted_at' => $status === PublicationStatus::Pending ? now() : null,
            ],
            tagIds: array_map(intval(...), $validated['tags']),
        );

        if ($request->hasFile('cover')) {
            $article->addMedia($request->file('cover'))->toMediaCollection('media');
        }

        return redirect()->route('dashboard.articles');
    }

    public function update(Request $request, Article $article, UpdateArticle $updateArticle): RedirectResponse
    {
        Gate::authorize('update', $article);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'locale' => ['required', 'string', 'in:fr,en'],
            'tags' => ['required', 'array', 'min:1', 'max:3'],
            'tags.*' => ['required', 'integer', 'exists:tags,id'],
            'is_draft' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'cover' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp,avif'],
            'cover_remove' => ['boolean'],
        ]);

        $isDraft = (bool) ($validated['is_draft'] ?? true);
        $canPublish = Gate::allows('articles:publish');

        $data = [
            'title' => $validated['title'],
            'body' => $validated['body'],
            'locale' => $validated['locale'],
        ];

        if (! $article->isPublished()) {
            $newStatus = $isDraft
                ? PublicationStatus::Draft
                : ($canPublish ? PublicationStatus::Published : PublicationStatus::Pending);

            $data['status'] = $newStatus;
            $data['published_at'] = $isDraft
                ? (null)
                : $validated['published_at'] ?? ($canPublish ? now() : null);

            if ($newStatus === PublicationStatus::Pending) {
                $data['submitted_at'] = now();
            }
        }

        $updateArticle(
            article: $article,
            data: $data,
            tagIds: array_map(intval(...), $validated['tags']),
        );

        if ($request->hasFile('cover')) {
            $article->addMedia($request->file('cover'))->toMediaCollection('media');
        } elseif ($request->boolean('cover_remove')) {
            $article->clearMediaCollection('media');
        }

        return redirect()->route('dashboard.articles');
    }

    public function submit(Article $article, SubmitArticle $submitArticle): RedirectResponse
    {
        Gate::authorize('update', $article);

        abort_if($article->isPublished(), 403);

        $submitArticle($article);

        return redirect()->route('dashboard.articles');
    }

    public function destroy(Article $article, DeleteArticle $deleteArticle): RedirectResponse
    {
        Gate::authorize('delete', $article);

        $deleteArticle($article);

        return redirect()->route('dashboard.articles');
    }

    public function manageIndex(Request $request): Response
    {
        Gate::authorize('articles:publish');

        $pendingArticles = Article::query()
            ->where('status', PublicationStatus::Pending)
            ->with(['author:id,name,username', 'tags:id,name,slug'])
            ->latest('submitted_at')
            ->get();

        $approvedArticles = Article::query()
            ->where('status', PublicationStatus::Approved)
            ->with(['author:id,name,username', 'tags:id,name,slug'])
            ->latest('approved_at')
            ->get();

        $publishedArticles = Article::query()
            ->where('status', PublicationStatus::Published)
            ->with(['author:id,name,username', 'tags:id,name,slug'])
            ->latest('published_at')
            ->get();

        return Inertia::render('dashboard/manage/articles', [
            'pendingArticles' => $pendingArticles,
            'approvedArticles' => $approvedArticles,
            'publishedArticles' => $publishedArticles,
            'canDelete' => Gate::allows('articles:delete'),
        ]);
    }

    public function publish(Article $article, PublishArticle $publishArticle): RedirectResponse
    {
        Gate::authorize('articles:publish');

        $publishArticle($article);

        return redirect()->route('manage.articles.index');
    }

    public function decline(Article $article, DeclineArticle $declineArticle): RedirectResponse
    {
        Gate::authorize('articles:publish');

        $declineArticle($article);

        return redirect()->route('manage.articles.index');
    }

    public function manageDestroy(Article $article, DeleteArticle $deleteArticle): RedirectResponse
    {
        Gate::authorize('articles:delete');

        $deleteArticle($article);

        return redirect()->route('manage.articles.index');
    }
}
