import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ArticleCreateSheet from '@/components/site/article-create-sheet';
import DashSidebar from '@/components/site/dashboard-sidebar';
import type { ArticleSummary, ArticleTag } from '@/types/article';

type DraftArticle = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    updated_at: string;
    tags: ArticleTag[];
};

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

type Props = {
    tags: ArticleTag[];
    publishedArticles: ArticleSummary[];
    draftArticles: DraftArticle[];
};

export default function DashboardArticles({
    tags = [],
    publishedArticles = [],
    draftArticles = [],
}: Props) {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <Head title="Mes articles — Laravel Sénégal" />

            <div className="mx-auto max-w-[1300px] px-6 py-8 lg:px-10">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <DashSidebar section="articles" />

                    <main className="min-w-0 space-y-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <div
                                    className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    // mes articles
                                </div>
                                <h1
                                    className="mt-1 text-[32px] font-semibold tracking-[-0.02em]"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    Mes articles
                                </h1>
                                <p
                                    className="mt-1 font-mono text-[13px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {publishedArticles.length} publié
                                    {publishedArticles.length !== 1
                                        ? 's'
                                        : ''}{' '}
                                    · {draftArticles.length} brouillon
                                    {draftArticles.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button
                                onClick={() => setSheetOpen(true)}
                                className="sn-btn sn-btn-primary"
                            >
                                Nouvel article
                            </button>
                        </div>

                        {/* Published */}
                        <div
                            className="rounded-xl p-6"
                            style={{
                                background: 'var(--sn-surface)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            <div
                                className="mb-4 font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                // publiés
                            </div>
                            {publishedArticles.length === 0 ? (
                                <p
                                    className="font-mono text-[12.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    Aucun article publié pour l'instant.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {publishedArticles.map((a) => (
                                        <div
                                            key={a.slug}
                                            className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                                            style={{
                                                borderColor: 'var(--sn-border)',
                                            }}
                                        >
                                            <div className="min-w-0">
                                                <div
                                                    className="text-[15px] font-semibold tracking-tight"
                                                    style={{
                                                        color: 'var(--sn-fg)',
                                                    }}
                                                >
                                                    {a.title}
                                                </div>
                                                <div
                                                    className="mt-0.5 font-mono text-[11.5px]"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                >
                                                    {a.published_at
                                                        ? fmtDate(
                                                              a.published_at,
                                                          )
                                                        : '—'}{' '}
                                                    · {a.reading_time_minutes}{' '}
                                                    min · {a.views_count} vues
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/articles/${a.slug}`}
                                                    className="sn-btn sn-btn-ghost sn-btn-sm"
                                                >
                                                    Voir
                                                </Link>
                                                <button className="sn-btn sn-btn-ghost sn-btn-sm">
                                                    Stats
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Drafts */}
                        <div
                            className="rounded-xl p-6"
                            style={{
                                background: 'var(--sn-surface)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            <div
                                className="mb-4 font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                // brouillons
                            </div>
                            {draftArticles.length === 0 ? (
                                <p
                                    className="font-mono text-[12.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    Aucun brouillon. Commence à écrire !
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {draftArticles.map((d) => (
                                        <div
                                            key={d.slug}
                                            className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                                            style={{
                                                borderColor: 'var(--sn-border)',
                                            }}
                                        >
                                            <div className="min-w-0">
                                                <div
                                                    className="text-[15px] font-semibold tracking-tight"
                                                    style={{
                                                        color: 'var(--sn-fg)',
                                                    }}
                                                >
                                                    {d.title}
                                                </div>
                                                <div
                                                    className="mt-0.5 font-mono text-[11.5px]"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                >
                                                    Modifié{' '}
                                                    {fmtDate(d.updated_at)}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="sn-btn sn-btn-ghost sn-btn-sm">
                                                    Reprendre
                                                </button>
                                                <button className="sn-btn sn-btn-ghost sn-btn-sm">
                                                    Publier
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <ArticleCreateSheet
                tags={tags}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </>
    );
}
