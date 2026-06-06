import { useForm } from '@inertiajs/react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ArticleController from '@/actions/App/Http/Controllers/ArticleController';
import { LazyMarkdownEditor as MarkdownEditor } from '@/components/editor/lazy-markdown-editor';
import { CoverImageUpload } from '@/components/site/cover-image-upload';
import { DatePicker } from '@/components/site/date-picker';
import { TagsSelect } from '@/components/site/tags-select';
import type { ArticleTag } from '@/types/article';

type Tag = ArticleTag;

type EditableArticle = {
    slug: string;
    title: string;
    body: string;
    locale: string;
    status: string;
    published_at: string | null;
    cover_url: string | null;
    tags: Tag[];
};

type Props = {
    tags: Tag[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    article?: EditableArticle | undefined;
    canPublish?: boolean;
};

function Label({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="mb-1.5 text-[12.5px] font-medium"
            style={{ color: 'var(--sn-fg)' }}
        >
            {children}
        </div>
    );
}

function FieldError({ message }: { message?: string | undefined }) {
    if (!message) {
        return null;
    }

    return (
        <p className="mt-1 text-[12px]" style={{ color: 'var(--destructive)' }}>
            {message}
        </p>
    );
}

export default function ArticleCreateSheet({
    tags,
    open,
    onOpenChange,
    article,
    canPublish = false,
}: Props) {
    const [tipsOpen, setTipsOpen] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: '',
        body: '',
        locale: 'fr' as 'fr' | 'en',
        tags: [] as number[],
        is_draft: true,
        published_at: '',
        cover: null as File | null,
        cover_remove: false,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        if (article) {
            setData({
                title: article.title,
                body: article.body,
                locale: article.locale as 'fr' | 'en',
                tags: article.tags.map((t) => t.id),
                is_draft: article.status === 'draft',
                published_at: article.published_at
                    ? article.published_at.split('T')[0]
                    : '',
                cover: null,
                cover_remove: false,
            });
        }
    }, [article?.slug, open]); // eslint-disable-line react-hooks/exhaustive-deps

    const isPublished = article?.status === 'published';

    const wordCount = data.body.trim()
        ? data.body.trim().split(/\s+/).length
        : 0;
    const readingMinutes = Math.max(1, Math.round(wordCount / 200));

    function handleClose(next: boolean) {
        if (!next) {
            reset();
            setTipsOpen(false);
        }

        onOpenChange(next);
    }

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();

        if (article) {
            patch(ArticleController.update.url({ article: article.slug }), {
                forceFormData: true,
                onSuccess: () => handleClose(false),
            });
        } else {
            post(ArticleController.store.url(), {
                forceFormData: true,
                onSuccess: () => handleClose(false),
            });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className="fixed inset-2 z-50 flex flex-col rounded-2xl shadow-2xl transition ease-in-out outline-none data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:slide-in-from-right sm:top-4 sm:right-4 sm:bottom-4 sm:left-auto sm:w-[760px] sm:max-w-[calc(100vw-32px)]"
                    style={{
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                    }}
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    {/* ── Header ── */}
                    <div
                        className="flex shrink-0 items-center justify-between px-6 py-4"
                        style={{
                            borderBottom: '1px solid var(--sn-border)',
                            background: 'var(--sn-surface)',
                            borderRadius: '16px 16px 0 0',
                        }}
                    >
                        <h2
                            className="text-[18px] font-semibold tracking-tight"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            {article
                                ? "Modifier l'article"
                                : 'Rédiger un article'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span
                                className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium"
                                style={{
                                    background: 'var(--sn-n200)',
                                    color: 'var(--sn-n500)',
                                }}
                            >
                                ESC
                            </span>
                            <Dialog.Close
                                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none"
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
                                <X size={16} />
                                <span className="sr-only">Fermer</span>
                            </Dialog.Close>
                        </div>
                    </div>

                    <form
                        id="article-form"
                        onSubmit={submit}
                        className="flex flex-1 flex-col overflow-hidden"
                    >
                        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                            {/* ── Tips ── */}
                            <CollapsiblePrimitive.Root
                                open={tipsOpen}
                                onOpenChange={setTipsOpen}
                            >
                                <CollapsiblePrimitive.Trigger
                                    className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left transition-opacity hover:opacity-80"
                                    style={{
                                        background: 'rgba(245,158,11,0.08)',
                                        border: '1px solid rgba(245,158,11,0.25)',
                                    }}
                                >
                                    <span
                                        className="text-[13px] font-medium"
                                        style={{ color: '#b45309' }}
                                    >
                                        💡 Conseils pour rédiger un bon article
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        style={{
                                            color: '#b45309',
                                            transform: tipsOpen
                                                ? 'rotate(180deg)'
                                                : 'none',
                                            transition: 'transform 200ms',
                                            flexShrink: 0,
                                        }}
                                    />
                                </CollapsiblePrimitive.Trigger>
                                <CollapsiblePrimitive.Content>
                                    <div
                                        className="mt-1 space-y-1 rounded-xl px-4 py-3 text-[12.5px]"
                                        style={{
                                            background: 'rgba(245,158,11,0.05)',
                                            border: '1px solid rgba(245,158,11,0.15)',
                                            color: '#92400e',
                                        }}
                                    >
                                        <p>
                                            • Le titre doit être clair,
                                            spécifique et refléter le contenu.
                                        </p>
                                        <p>
                                            • Rédige au minimum 500 mots avec
                                            des exemples de code concrets.
                                        </p>
                                        <p>
                                            • Choisis 1 à 3 tags pertinents pour
                                            la visibilité.
                                        </p>
                                        <p>
                                            • Les articles en brouillon ne sont
                                            visibles que par toi.
                                        </p>
                                        <p>
                                            • Les articles soumis sont relus
                                            avant publication.
                                        </p>
                                    </div>
                                </CollapsiblePrimitive.Content>
                            </CollapsiblePrimitive.Root>

                            {/* ── Title ── */}
                            <div>
                                <Label>Titre</Label>
                                <input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Un titre accrocheur pour ton article…"
                                    required
                                    className="w-full rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors focus:outline-none"
                                    style={{
                                        background: 'var(--sn-surface)',
                                        border: `1px solid ${errors.title ? 'var(--destructive)' : 'var(--sn-border)'}`,
                                        color: 'var(--sn-fg)',
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor =
                                            'var(--sn-accent)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor =
                                            errors.title
                                                ? 'var(--destructive)'
                                                : 'var(--sn-border)';
                                    }}
                                />
                                <FieldError message={errors.title} />
                            </div>

                            {/* ── Draft + date + locale ── */}
                            <div className="space-y-3">
                                {/* Draft toggle + date side by side */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div
                                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${isPublished ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        style={{
                                            background: 'var(--sn-surface)',
                                            border: '1px solid var(--sn-border)',
                                        }}
                                        onClick={() =>
                                            !isPublished &&
                                            setData('is_draft', !data.is_draft)
                                        }
                                    >
                                        <div>
                                            <div
                                                className="text-[13px] font-medium"
                                                style={{
                                                    color: 'var(--sn-fg)',
                                                }}
                                            >
                                                Brouillon
                                            </div>
                                            <div
                                                className="mt-0.5 text-[11.5px]"
                                                style={{
                                                    color: 'var(--sn-muted)',
                                                }}
                                            >
                                                {data.is_draft
                                                    ? 'Privé'
                                                    : 'Soumis à modération'}
                                            </div>
                                        </div>
                                        <div
                                            className="relative ml-3 h-5 w-9 shrink-0 rounded-full transition-colors"
                                            style={{
                                                background: data.is_draft
                                                    ? 'var(--sn-accent)'
                                                    : 'var(--sn-surface-2)',
                                            }}
                                        >
                                            <span
                                                className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                                                style={{
                                                    transform: data.is_draft
                                                        ? 'translateX(16px)'
                                                        : 'translateX(0)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <DatePicker
                                        value={data.published_at}
                                        onChange={(v) =>
                                            setData('published_at', v)
                                        }
                                        {...(!isPublished && {
                                            min: new Date()
                                                .toISOString()
                                                .split('T')[0],
                                        })}
                                        disabled={data.is_draft || isPublished}
                                        label={
                                            canPublish
                                                ? 'Date de publication'
                                                : 'Date souhaitée'
                                        }
                                        hint={
                                            canPublish
                                                ? undefined
                                                : 'Indicative — la date finale est fixée par les modérateurs.'
                                        }
                                    />
                                </div>

                                {/* Locale */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div
                                            className="text-[13.5px] font-medium"
                                            style={{ color: 'var(--sn-fg)' }}
                                        >
                                            Langue
                                        </div>
                                        <div
                                            className="mt-0.5 text-[12px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            Langue de rédaction de l'article
                                        </div>
                                    </div>
                                    <div
                                        className="flex gap-0.5 rounded-lg p-0.5"
                                        style={{
                                            background: 'var(--sn-surface-2)',
                                        }}
                                    >
                                        {(['fr', 'en'] as const).map((loc) => (
                                            <button
                                                key={loc}
                                                type="button"
                                                disabled={isPublished}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData('locale', loc);
                                                }}
                                                className="rounded-md px-4 py-1.5 text-[12.5px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                                style={{
                                                    background:
                                                        data.locale === loc
                                                            ? 'var(--sn-bg)'
                                                            : 'transparent',
                                                    color:
                                                        data.locale === loc
                                                            ? 'var(--sn-fg)'
                                                            : 'var(--sn-muted)',
                                                    boxShadow:
                                                        data.locale === loc
                                                            ? '0 1px 4px rgba(0,0,0,0.12)'
                                                            : 'none',
                                                }}
                                            >
                                                {loc.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Tags ── */}
                            <div>
                                <Label>Tags</Label>
                                <TagsSelect
                                    tags={tags}
                                    selected={data.tags}
                                    onChange={(ids) => setData('tags', ids)}
                                    error={errors.tags as string | undefined}
                                />
                            </div>

                            {/* ── Cover image ── */}
                            <CoverImageUpload
                                value={data.cover}
                                existingUrl={
                                    data.cover_remove
                                        ? null
                                        : (article?.cover_url ?? null)
                                }
                                onChange={(file) =>
                                    setData((prev) => ({
                                        ...prev,
                                        cover: file,
                                        cover_remove: false,
                                    }))
                                }
                                onRemoveExisting={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        cover: null,
                                        cover_remove: true,
                                    }))
                                }
                                error={errors.cover}
                            />

                            {/* ── Markdown editor ── */}
                            <div>
                                <Label>Contenu</Label>
                                <MarkdownEditor
                                    value={data.body}
                                    onChange={(v) => setData('body', v)}
                                    error={errors.body}
                                    scope="full"
                                    allowImages
                                    minHeight={320}
                                    maxHeight={420}
                                    placeholder="Écris ton article…"
                                    disabled={processing}
                                />
                                <div className="mt-1.5 flex items-center justify-between">
                                    <span
                                        className="font-mono text-[11px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        {wordCount > 0
                                            ? `${wordCount} mots · ~${readingMinutes} min de lecture`
                                            : 'Markdown supporté'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Footer ── */}
                        <div
                            className="flex shrink-0 items-center justify-end gap-3 px-6 py-4"
                            style={{
                                borderTop: '1px solid var(--sn-border)',
                                background: 'var(--sn-surface)',
                                borderRadius: '0 0 16px 16px',
                            }}
                        >
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="sn-btn sn-btn-secondary"
                                    disabled={processing}
                                >
                                    Annuler
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                form="article-form"
                                className="sn-btn sn-btn-primary"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Enregistrement…'
                                    : article
                                      ? 'Mettre à jour'
                                      : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
