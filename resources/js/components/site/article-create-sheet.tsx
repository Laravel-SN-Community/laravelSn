import { useForm } from '@inertiajs/react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import {
    Bold,
    ChevronDown,
    Code,
    Code2,
    Heading2,
    Italic,
    Link,
    List,
    ListOrdered,
    Quote,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ArticleController from '@/actions/App/Http/Controllers/ArticleController';
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

type ToolbarItem =
    | { type: 'sep' }
    | {
          type: 'btn';
          icon: React.ElementType;
          label: string;
          before: string;
          after: string;
      };

const TOOLBAR: ToolbarItem[] = [
    { type: 'btn', icon: Heading2, label: 'H2  ⌘2', before: '## ', after: '' },
    { type: 'btn', icon: Bold, label: 'Gras  ⌘B', before: '**', after: '**' },
    {
        type: 'btn',
        icon: Italic,
        label: 'Italique  ⌘I',
        before: '_',
        after: '_',
    },
    { type: 'sep' },
    { type: 'btn', icon: Quote, label: 'Citation', before: '> ', after: '' },
    { type: 'btn', icon: Code, label: 'Code inline', before: '`', after: '`' },
    {
        type: 'btn',
        icon: Code2,
        label: 'Bloc de code',
        before: '```\n',
        after: '\n```',
    },
    { type: 'sep' },
    {
        type: 'btn',
        icon: Link,
        label: 'Lien  ⌘K',
        before: '[',
        after: '](url)',
    },
    { type: 'sep' },
    { type: 'btn', icon: List, label: 'Liste', before: '- ', after: '' },
    {
        type: 'btn',
        icon: ListOrdered,
        label: 'Numérotée',
        before: '1. ',
        after: '',
    },
];

function renderMarkdown(md: string): string {
    if (!md.trim()) {
        return '';
    }

    const blocks: string[] = [];
    const withoutCode = md.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => {
        const idx = blocks.length;
        blocks.push(
            `<pre style="background:var(--sn-surface-2);border-radius:8px;padding:14px 16px;overflow:auto;font-family:monospace;font-size:12.5px;margin:10px 0;white-space:pre;line-height:1.6">${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
        );

        return `%%CB${idx}%%`;
    });
    let out = withoutCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(
            /^### (.*)$/gm,
            '<h3 style="font-size:15px;font-weight:700;margin:14px 0 4px;color:var(--sn-fg)">$1</h3>',
        )
        .replace(
            /^## (.*)$/gm,
            '<h2 style="font-size:19px;font-weight:700;margin:20px 0 6px;color:var(--sn-fg)">$1</h2>',
        )
        .replace(
            /^# (.*)$/gm,
            '<h1 style="font-size:24px;font-weight:800;margin:20px 0 8px;color:var(--sn-fg)">$1</h1>',
        )
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(
            /`([^`\n]+?)`/g,
            '<code style="background:var(--sn-surface-2);border-radius:4px;padding:2px 6px;font-family:monospace;font-size:12.5px">$1</code>',
        )
        .replace(
            /^> (.*)$/gm,
            '<blockquote style="border-left:3px solid var(--sn-accent);padding:4px 14px;color:var(--sn-muted);margin:8px 0;font-style:italic">$1</blockquote>',
        )
        .replace(
            /^[-*] (.*)$/gm,
            '<li style="margin:3px 0;padding-left:4px">• $1</li>',
        )
        .replace(
            /^\d+\. (.*)$/gm,
            '<li style="margin:3px 0;padding-left:4px;list-style:decimal inside">$1</li>',
        );
    blocks.forEach((b, i) => {
        out = out.replace(`%%CB${i}%%`, b);
    });

    return (
        '<p style="margin:0;line-height:1.7">' +
        out
            .replace(/\n\n/g, '</p><p style="margin:10px 0;line-height:1.7">')
            .replace(/\n/g, '<br/>') +
        '</p>'
    );
}

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
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const bodyRef = useRef<HTMLTextAreaElement>(null);

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
            setTab('write');
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

    function insertMarkdown(before: string, after: string) {
        const ta = bodyRef.current;

        if (!ta) {
            return;
        }

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const sel = data.body.substring(start, end);
        setData(
            'body',
            data.body.substring(0, start) +
                before +
                sel +
                after +
                data.body.substring(end),
        );
        requestAnimationFrame(() => {
            ta.focus();
            ta.setSelectionRange(
                start + before.length,
                start + before.length + sel.length,
            );
        });
    }

    function handleBodyKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        const mod = e.metaKey || e.ctrlKey;

        if (mod && e.key === 'b') {
            e.preventDefault();
            insertMarkdown('**', '**');
        }

        if (mod && e.key === 'i') {
            e.preventDefault();
            insertMarkdown('_', '_');
        }

        if (mod && e.key === 'k') {
            e.preventDefault();
            insertMarkdown('[', '](url)');
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            insertMarkdown('    ', '');
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
                                {/* Tab bar sits above the editor border */}
                                <div className="flex items-end justify-between">
                                    <Label>Contenu</Label>
                                    <div
                                        className="flex"
                                        style={{
                                            marginBottom: '-1px',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        {(['write', 'preview'] as const).map(
                                            (t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setTab(t)}
                                                    className="rounded-t-lg px-4 py-1.5 text-[12.5px] font-medium transition-colors"
                                                    style={{
                                                        background:
                                                            tab === t
                                                                ? 'var(--sn-surface)'
                                                                : 'transparent',
                                                        color:
                                                            tab === t
                                                                ? 'var(--sn-fg)'
                                                                : 'var(--sn-muted)',
                                                        border:
                                                            tab === t
                                                                ? '1px solid var(--sn-border)'
                                                                : '1px solid transparent',
                                                        borderBottom:
                                                            tab === t
                                                                ? '1px solid var(--sn-surface)'
                                                                : '1px solid transparent',
                                                    }}
                                                >
                                                    {t === 'write'
                                                        ? 'Rédiger'
                                                        : 'Aperçu'}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div
                                    className="overflow-hidden rounded-tl-xl rounded-b-xl"
                                    style={{
                                        border: '1px solid var(--sn-border)',
                                    }}
                                >
                                    {/* Toolbar — write mode only */}
                                    {tab === 'write' && (
                                        <div
                                            className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
                                            style={{
                                                background: 'var(--sn-surface)',
                                                borderBottom:
                                                    '1px solid var(--sn-border)',
                                            }}
                                        >
                                            {TOOLBAR.map((item, i) =>
                                                item.type === 'sep' ? (
                                                    <span
                                                        key={`sep-${i}`}
                                                        className="mx-1 h-4 w-px"
                                                        style={{
                                                            background:
                                                                'var(--sn-border)',
                                                        }}
                                                    />
                                                ) : (
                                                    <button
                                                        key={item.label}
                                                        type="button"
                                                        title={item.label}
                                                        onClick={() =>
                                                            insertMarkdown(
                                                                item.before,
                                                                item.after,
                                                            )
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                                                        style={{
                                                            color: 'var(--sn-muted)',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background =
                                                                'var(--sn-surface-2)';
                                                            e.currentTarget.style.color =
                                                                'var(--sn-fg)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background =
                                                                'transparent';
                                                            e.currentTarget.style.color =
                                                                'var(--sn-muted)';
                                                        }}
                                                    >
                                                        <item.icon size={14} />
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}

                                    {tab === 'write' ? (
                                        <textarea
                                            ref={bodyRef}
                                            value={data.body}
                                            onChange={(e) =>
                                                setData('body', e.target.value)
                                            }
                                            onKeyDown={handleBodyKeyDown}
                                            placeholder={
                                                '# Mon article\n\nCommence à rédiger ici…'
                                            }
                                            className="w-full resize-none px-4 py-3 text-[13px] leading-relaxed focus:outline-none"
                                            style={{
                                                background: 'var(--sn-bg)',
                                                color: 'var(--sn-fg)',
                                                height: '280px',
                                                display: 'block',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="overflow-auto px-5 py-4 text-[14px] leading-relaxed"
                                            style={{
                                                background: 'var(--sn-bg)',
                                                color: 'var(--sn-fg)',
                                                height: '280px',
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    renderMarkdown(data.body) ||
                                                    '<p style="color:var(--sn-muted);font-style:italic;font-size:13px;margin:0">Aucun contenu à prévisualiser…</p>',
                                            }}
                                        />
                                    )}

                                    {/* Status bar */}
                                    <div
                                        className="flex items-center justify-between px-3 py-1.5"
                                        style={{
                                            background: 'var(--sn-surface)',
                                            borderTop:
                                                '1px solid var(--sn-border)',
                                        }}
                                    >
                                        <span
                                            className="font-mono text-[11px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            {wordCount > 0
                                                ? `${wordCount} mots · ~${readingMinutes} min de lecture`
                                                : 'Markdown supporté'}
                                        </span>
                                        <span
                                            className="font-mono text-[11px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            {tab === 'write'
                                                ? '⌘B ⌘I ⌘K'
                                                : 'Aperçu'}
                                        </span>
                                    </div>
                                </div>

                                <FieldError message={errors.body} />
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
