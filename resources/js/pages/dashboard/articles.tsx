import { Head, Link } from '@inertiajs/react';
import DashSidebar from '@/components/site/dashboard-sidebar';
import { ARTICLES } from '@/data/community';

const DRAFTS = [
    { title: 'Scout + Meilisearch : setup complet', updatedAt: 'il y a 2 jours' },
    { title: 'Pattern Repository dans une app Laravel réelle', updatedAt: 'il y a 5 jours' },
];

export default function DashboardArticles() {
    const publishedArticles = ARTICLES.slice(0, 2);

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
                                    2 publiés · 2 brouillons
                                </p>
                            </div>
                            <Link
                                href="/articles/nouveau"
                                className="sn-btn sn-btn-primary"
                            >
                                Nouvel article
                            </Link>
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
                            <div className="space-y-4">
                                {publishedArticles.map((a) => (
                                    <div
                                        key={a.slug}
                                        className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                                        style={{ borderColor: 'var(--sn-border)' }}
                                    >
                                        <div className="min-w-0">
                                            <div
                                                className="text-[15px] font-semibold tracking-tight"
                                                style={{ color: 'var(--sn-fg)' }}
                                            >
                                                {a.title}
                                            </div>
                                            <div
                                                className="mt-0.5 font-mono text-[11.5px]"
                                                style={{ color: 'var(--sn-muted)' }}
                                            >
                                                {a.date} · {a.readMinutes} min · 128 réactions
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/articles/${a.slug}`}
                                                className="sn-btn sn-btn-ghost sn-btn-sm"
                                            >
                                                Modifier
                                            </Link>
                                            <button className="sn-btn sn-btn-ghost sn-btn-sm">
                                                Stats
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <div className="space-y-4">
                                {DRAFTS.map((d, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                                        style={{ borderColor: 'var(--sn-border)' }}
                                    >
                                        <div className="min-w-0">
                                            <div
                                                className="text-[15px] font-semibold tracking-tight"
                                                style={{ color: 'var(--sn-fg)' }}
                                            >
                                                {d.title}
                                            </div>
                                            <div
                                                className="mt-0.5 font-mono text-[11.5px]"
                                                style={{ color: 'var(--sn-muted)' }}
                                            >
                                                Modifié {d.updatedAt}
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
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
