import { Head } from '@inertiajs/react';
import { ArrowRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ArticleCard from '@/components/site/article-card';
import { ALL_TAGS, ARTICLES } from '@/data/community';

const PER_PAGE = 6;

export default function Articles() {
    const [tag, setTag] = useState('Tous');
    const [sort, setSort] = useState('recent');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let list = [...ARTICLES];

        if (tag !== 'Tous') {
            list = list.filter((a) => a.tag === tag);
        }

        if (q.trim()) {
            const s = q.toLowerCase();
            list = list.filter(
                (a) =>
                    a.title.toLowerCase().includes(s) ||
                    a.excerpt.toLowerCase().includes(s) ||
                    a.author.toLowerCase().includes(s),
            );
        }

        if (sort === 'recent') {
            list.sort((a, b) => b.dateISO.localeCompare(a.dateISO));
        }

        if (sort === 'ancien') {
            list.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
        }

        if (sort === 'long') {
            list.sort((a, b) => b.readMinutes - a.readMinutes);
        }

        if (sort === 'court') {
            list.sort((a, b) => a.readMinutes - b.readMinutes);
        }

        return list;
    }, [tag, sort, q]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleTagChange = (t: string) => {
        setTag(t);
        setPage(1);
    };
    const handleSortChange = (s: string) => {
        setSort(s);
        setPage(1);
    };
    const handleQChange = (v: string) => {
        setQ(v);
        setPage(1);
    };

    return (
        <>
            <Head title="Articles — Laravel Sénégal" />

            {/* Page header */}
            <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-10 lg:px-10 lg:pt-16">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-[60ch]">
                        <div
                            className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            // articles
                        </div>
                        <h1
                            className="mt-2 text-[40px] leading-[1.02] font-semibold tracking-[-0.025em] lg:text-[56px]"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            Écrits par la communauté.
                        </h1>
                        <p
                            className="mt-4 text-[16px] leading-relaxed lg:text-[17px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Retours d'expérience, guides techniques et patterns
                            éprouvés — en français, ancrés dans notre contexte
                            ouest-africain.
                        </p>
                    </div>
                    <a
                        href="https://github.com/laravel-sn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sn-btn sn-btn-primary"
                    >
                        Écrire un article <ArrowRight size={13} />
                    </a>
                </div>
            </section>

            {/* Filters */}
            <section className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="sn-card p-4 md:p-5">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div
                            className="flex min-w-[240px] flex-1 items-center gap-2 rounded-md px-3"
                            style={{
                                background: 'var(--sn-surface-2)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{
                                    color: 'var(--sn-muted)',
                                    flexShrink: 0,
                                }}
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                value={q}
                                onChange={(e) => handleQChange(e.target.value)}
                                placeholder="Chercher un article…"
                                className="flex-1 bg-transparent py-2.5 text-[14px] outline-none"
                                style={{ color: 'var(--sn-fg)' }}
                            />
                            {q && (
                                <button
                                    onClick={() => handleQChange('')}
                                    aria-label="Effacer"
                                >
                                    <X
                                        size={14}
                                        style={{ color: 'var(--sn-muted)' }}
                                    />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="max-w-[180px] rounded-md px-3 py-2 font-mono text-[13px]"
                            style={{
                                background: 'var(--sn-surface)',
                                border: '1px solid var(--sn-border)',
                                color: 'var(--sn-fg)',
                            }}
                        >
                            <option value="recent">Plus récents</option>
                            <option value="ancien">Plus anciens</option>
                            <option value="long">Lecture longue</option>
                            <option value="court">Lecture rapide</option>
                        </select>
                    </div>

                    {/* Tag chips */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {ALL_TAGS.map((t) => (
                            <button
                                key={t}
                                onClick={() => handleTagChange(t)}
                                className="rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors"
                                style={
                                    tag === t
                                        ? {
                                              background: 'var(--sn-accent)',
                                              color: 'var(--sn-accent-fg)',
                                          }
                                        : {
                                              background: 'var(--sn-surface-2)',
                                              color: 'var(--sn-muted)',
                                              border: '1px solid var(--sn-border)',
                                          }
                                }
                            >
                                #{t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count + page */}
                <div className="mt-6 mb-4 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 font-mono text-[12px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        <span
                            className="h-1 w-1 rounded-full"
                            style={{ background: 'var(--sn-accent)' }}
                        />
                        <span>
                            <span style={{ color: 'var(--sn-fg)' }}>
                                {filtered.length}
                            </span>{' '}
                            {filtered.length === 1 ? 'article' : 'articles'}
                        </span>
                    </div>
                    <div
                        className="font-mono text-[11.5px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        page {page} / {totalPages}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="mx-auto max-w-[1400px] px-6 lg:px-10">
                {paged.length === 0 ? (
                    <div className="sn-card p-10 text-center">
                        <div
                            className="mb-2 font-mono text-[12px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            // aucun résultat
                        </div>
                        <p
                            className="text-[15px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Essaie d'enlever un filtre ou de changer ta
                            recherche.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {paged.map((a) => (
                            <ArticleCard
                                key={a.slug}
                                slug={a.slug}
                                tag={a.tag}
                                title={a.title}
                                excerpt={a.excerpt}
                                author={a.author}
                                date={a.date}
                                readMinutes={a.readMinutes}
                                tint={a.tint}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                            style={page === 1 ? { opacity: 0.4 } : {}}
                        >
                            ← Préc.
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className="h-9 w-9 rounded-md font-mono text-[13px]"
                                style={
                                    page === i + 1
                                        ? {
                                              background: 'var(--sn-fg)',
                                              color: 'var(--sn-bg)',
                                          }
                                        : {
                                              background: 'var(--sn-surface)',
                                              color: 'var(--sn-fg)',
                                              border: '1px solid var(--sn-border)',
                                          }
                                }
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page === totalPages}
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                            style={page === totalPages ? { opacity: 0.4 } : {}}
                        >
                            Suiv. →
                        </button>
                    </div>
                )}
            </section>

            <div className="pb-20" />
        </>
    );
}
