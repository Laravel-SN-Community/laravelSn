import { Head, Link, router } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2, X } from 'lucide-react';
import { useState } from 'react';
import ArticleController from '@/actions/App/Http/Controllers/ArticleController';
import ArticleCreateSheet from '@/components/site/article-create-sheet';
import DashSidebar from '@/components/site/dashboard-sidebar';
import type { ArticleTag } from '@/types/article';

type DashboardArticle = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    locale: string;
    status: string;
    published_at: string | null;
    reading_time_minutes: number;
    views_count: number;
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
    publishedArticles: DashboardArticle[];
    draftArticles: DashboardArticle[];
};

export default function DashboardArticles({
    tags = [],
    publishedArticles = [],
    draftArticles = [],
}: Props) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editArticle, setEditArticle] = useState<DashboardArticle | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] = useState<DashboardArticle | null>(
        null,
    );

    function openCreate() {
        setEditArticle(null);
        setSheetOpen(true);
    }

    function openEdit(a: DashboardArticle) {
        setEditArticle(a);
        setSheetOpen(true);
    }

    function handleSheetChange(next: boolean) {
        if (!next) {
            setEditArticle(null);
        }

        setSheetOpen(next);
    }

    function handlePublish(slug: string) {
        router.post(ArticleController.publish.url({ article: slug }));
    }

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(
            ArticleController.destroy.url({ article: deleteTarget.slug }),
            { onFinish: () => setDeleteTarget(null) },
        );
    }

    return (
        <>
            <Head title="Mes articles — Laravel Sénégal" />

            <div className="mx-auto max-w-[1300px] px-6 py-8 lg:px-10">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <DashSidebar section="articles" />

                    <main className="min-w-0 space-y-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
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
                                onClick={openCreate}
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
                            <h3
                                className="mb-4 text-[13px] font-semibold tracking-wide uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Publiés
                            </h3>
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
                                                    min ·{' '}
                                                    {a.views_count.toLocaleString(
                                                        'fr-FR',
                                                    )}{' '}
                                                    vues
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/articles/${a.slug}`}
                                                    className="sn-btn sn-btn-ghost sn-btn-sm"
                                                >
                                                    Voir
                                                </Link>
                                                <button
                                                    onClick={() => openEdit(a)}
                                                    className="sn-btn sn-btn-ghost sn-btn-sm"
                                                >
                                                    Modifier
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
                            <h3
                                className="mb-4 text-[13px] font-semibold tracking-wide uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Brouillons
                            </h3>
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(d)}
                                                    className="sn-btn sn-btn-ghost sn-btn-sm"
                                                >
                                                    Reprendre
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handlePublish(d.slug)
                                                    }
                                                    className="sn-btn sn-btn-ghost sn-btn-sm"
                                                >
                                                    Publier
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(d)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                    title="Supprimer"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            'color-mix(in oklch, var(--destructive) 10%, transparent)';
                                                        e.currentTarget.style.color =
                                                            'var(--destructive)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            'transparent';
                                                        e.currentTarget.style.color =
                                                            'var(--sn-muted)';
                                                    }}
                                                >
                                                    <Trash2 size={14} />
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

            {/* Delete confirm modal */}
            <Dialog.Root
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                    <Dialog.Content
                        className="fixed top-1/2 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                        style={{
                            background: 'var(--sn-bg)',
                            border: '1px solid var(--sn-border)',
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                style={{
                                    background:
                                        'color-mix(in oklch, var(--destructive) 10%, transparent)',
                                }}
                            >
                                <Trash2
                                    size={18}
                                    style={{ color: 'var(--destructive)' }}
                                />
                            </div>
                            <Dialog.Close
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none"
                                style={{ color: 'var(--sn-muted)' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        'var(--sn-surface-2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        'transparent';
                                }}
                            >
                                <X size={14} />
                            </Dialog.Close>
                        </div>

                        <Dialog.Title
                            className="mt-4 text-[17px] font-semibold tracking-tight"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            Supprimer le brouillon
                        </Dialog.Title>
                        <Dialog.Description
                            className="mt-1.5 text-[13.5px] leading-relaxed"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Le brouillon{' '}
                            <span
                                className="font-medium"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                «&nbsp;{deleteTarget?.title}&nbsp;»
                            </span>{' '}
                            sera supprimé définitivement. Cette action est
                            irréversible.
                        </Dialog.Description>

                        <div className="mt-6 flex justify-end gap-3">
                            <Dialog.Close className="sn-btn sn-btn-secondary sn-btn-sm">
                                Annuler
                            </Dialog.Close>
                            <button
                                onClick={confirmDelete}
                                className="sn-btn sn-btn-sm rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors focus:outline-none"
                                style={{
                                    background: 'var(--destructive)',
                                    color: '#fff',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.88';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <ArticleCreateSheet
                tags={tags}
                open={sheetOpen}
                onOpenChange={handleSheetChange}
                article={editArticle ?? undefined}
            />
        </>
    );
}
