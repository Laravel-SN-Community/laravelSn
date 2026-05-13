import { useForm } from '@inertiajs/react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import {
    Bold,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
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

type Tag = { id: number; name: string; slug: string };

type EditableArticle = {
    slug: string;
    title: string;
    body: string;
    locale: string;
    status: string;
    published_at: string | null;
    tags: Tag[];
};

type Props = {
    tags: Tag[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    article?: EditableArticle | undefined;
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

type DateCell = { day: number; type: 'prev' | 'curr' | 'next' };

function DatePicker({
    value,
    onChange,
    min,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    min?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = min ? new Date(min + 'T00:00:00') : today;
    const selected = value ? new Date(value + 'T00:00:00') : null;

    const [view, setView] = useState(() => {
        const base = selected ?? today;

        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    useEffect(() => {
        function onOut(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', onOut);
        }

        return () => document.removeEventListener('mousedown', onOut);
    }, [open]);

    const monthLabel = view.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
    });
    const firstDayMon =
        (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
    const daysInMonth = new Date(
        view.getFullYear(),
        view.getMonth() + 1,
        0,
    ).getDate();
    const daysInPrevMonth = new Date(
        view.getFullYear(),
        view.getMonth(),
        0,
    ).getDate();

    const cells: DateCell[] = [];

    for (let i = firstDayMon - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, type: 'prev' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, type: 'curr' });
    }

    let next = 1;

    while (cells.length % 7 !== 0) {
        cells.push({ day: next++, type: 'next' });
    }

    function cellDate(cell: DateCell): Date {
        let m = view.getMonth(),
            y = view.getFullYear();

        if (cell.type === 'prev') {
            m--;

            if (m < 0) {
                m = 11;
                y--;
            }
        }

        if (cell.type === 'next') {
            m++;

            if (m > 11) {
                m = 0;
                y++;
            }
        }

        return new Date(y, m, cell.day);
    }

    function pick(cell: DateCell) {
        const d = cellDate(cell);

        if (d < minDate) {
            return;
        }

        onChange(d.toISOString().split('T')[0]);
        setOpen(false);

        if (cell.type !== 'curr') {
            setView(new Date(d.getFullYear(), d.getMonth(), 1));
        }
    }

    function isSel(cell: DateCell) {
        if (!selected) {
            return false;
        }

        const d = cellDate(cell);

        return d.toDateString() === selected.toDateString();
    }

    function isDis(cell: DateCell) {
        return cellDate(cell) < minDate;
    }
    function isTod(cell: DateCell) {
        return cellDate(cell).toDateString() === today.toDateString();
    }

    const displayValue = selected
        ? selected.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;

    return (
        <div
            style={{
                opacity: disabled ? 0.4 : 1,
                transition: 'opacity 200ms',
                pointerEvents: disabled ? 'none' : 'auto',
            }}
        >
            <div
                className="mb-1.5 text-[12px] font-medium"
                style={{ color: 'var(--sn-fg)' }}
            >
                Date de publication
            </div>
            <div ref={ref} className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none"
                    style={{
                        background: 'var(--sn-surface)',
                        border: `1px solid ${open ? 'var(--sn-accent)' : 'var(--sn-border)'}`,
                        color: displayValue
                            ? 'var(--sn-fg)'
                            : 'var(--sn-muted)',
                    }}
                >
                    <Calendar
                        size={14}
                        style={{ color: 'var(--sn-muted)', flexShrink: 0 }}
                    />
                    <span className="flex-1 text-[13.5px]">
                        {displayValue ?? 'Sélectionner une date'}
                    </span>
                    <ChevronDown
                        size={13}
                        style={{
                            color: 'var(--sn-muted)',
                            flexShrink: 0,
                            transform: open ? 'rotate(180deg)' : 'none',
                            transition: 'transform 180ms',
                        }}
                    />
                </button>

                {/* Dropdown */}
                {open && (
                    <div
                        className="absolute top-full right-0 left-0 z-30 mt-1 rounded-xl p-4 shadow-xl"
                        style={{
                            background: 'var(--sn-bg)',
                            border: '1px solid var(--sn-border)',
                        }}
                    >
                        {/* Month nav */}
                        <div className="mb-3 flex items-center justify-between">
                            <span
                                className="text-[13px] font-semibold capitalize"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {monthLabel}
                            </span>
                            <div className="flex items-center gap-0.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setView(
                                            new Date(
                                                view.getFullYear(),
                                                view.getMonth() - 1,
                                                1,
                                            ),
                                        )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
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
                                    <ChevronLeft size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setView(
                                            new Date(
                                                view.getFullYear(),
                                                view.getMonth() + 1,
                                                1,
                                            ),
                                        )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
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
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="mb-1 grid grid-cols-7">
                            {['lu', 'ma', 'me', 'je', 've', 'sa', 'di'].map(
                                (d) => (
                                    <div
                                        key={d}
                                        className="flex h-8 items-center justify-center text-[11.5px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        {d}
                                    </div>
                                ),
                            )}
                        </div>

                        {/* Day grid */}
                        <div className="grid grid-cols-7">
                            {cells.map((cell, i) => {
                                const sel = isSel(cell);
                                const dis = isDis(cell);
                                const tod = isTod(cell);
                                const overflow = cell.type !== 'curr';

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center py-0.5"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => pick(cell)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors"
                                            style={{
                                                background: sel
                                                    ? 'var(--sn-accent)'
                                                    : 'transparent',
                                                color: sel
                                                    ? 'var(--sn-accent-fg)'
                                                    : dis
                                                      ? 'var(--sn-border)'
                                                      : overflow
                                                        ? 'color-mix(in oklch, var(--sn-muted) 50%, transparent)'
                                                        : 'var(--sn-fg)',
                                                cursor: dis
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!dis && !sel) {
                                                    e.currentTarget.style.background =
                                                        'var(--sn-surface-2)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!sel) {
                                                    e.currentTarget.style.background =
                                                        'transparent';
                                                }
                                            }}
                                        >
                                            {cell.day}
                                        </button>
                                        {tod && !sel && (
                                            <span
                                                className="h-1 w-1 rounded-full"
                                                style={{
                                                    background:
                                                        'var(--sn-accent)',
                                                    marginTop: '-2px',
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <p
                className="mt-1 text-[11px]"
                style={{ color: 'var(--sn-muted)' }}
            >
                Indicatif — fixée par les modérateurs.
            </p>
        </div>
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

function TagsSelect({
    tags,
    selected,
    onChange,
    error,
}: {
    tags: Tag[];
    selected: number[];
    onChange: (ids: number[]) => void;
    error?: string | undefined;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onOut(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', onOut);
        }

        return () => document.removeEventListener('mousedown', onOut);
    }, [open]);

    function toggle(id: number) {
        if (selected.includes(id)) {
            onChange(selected.filter((t) => t !== id));
        } else if (selected.length < 3) {
            onChange([...selected, id]);
        }
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] transition-colors focus:outline-none"
                style={{
                    background: 'var(--sn-surface)',
                    border: `1px solid ${error ? 'var(--destructive)' : open ? 'var(--sn-accent)' : 'var(--sn-border)'}`,
                    color:
                        selected.length === 0
                            ? 'var(--sn-muted)'
                            : 'var(--sn-fg)',
                }}
            >
                <span>
                    {selected.length === 0
                        ? 'Sélectionner 1 à 3 tags…'
                        : `${selected.length} tag${selected.length > 1 ? 's' : ''} sélectionné${selected.length > 1 ? 's' : ''}`}
                </span>
                <ChevronDown
                    size={14}
                    style={{
                        color: 'var(--sn-muted)',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 180ms',
                        flexShrink: 0,
                    }}
                />
            </button>

            {open && (
                <div
                    className="absolute top-full right-0 left-0 z-20 mt-1 max-h-52 overflow-y-auto rounded-lg py-1 shadow-xl"
                    style={{
                        background: 'var(--sn-surface)',
                        border: '1px solid var(--sn-border)',
                    }}
                >
                    {tags.map((tag) => {
                        const isSel = selected.includes(tag.id);
                        const isOff = !isSel && selected.length >= 3;

                        return (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => !isOff && toggle(tag.id)}
                                className="flex w-full items-center justify-between px-3 py-2 text-[13px]"
                                style={{
                                    color: isOff
                                        ? 'var(--sn-border)'
                                        : 'var(--sn-fg)',
                                    cursor: isOff ? 'not-allowed' : 'pointer',
                                    background: isSel
                                        ? 'color-mix(in oklch, var(--sn-accent) 10%, transparent)'
                                        : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isOff) {
                                        e.currentTarget.style.background =
                                            'var(--sn-surface-2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isSel
                                        ? 'color-mix(in oklch, var(--sn-accent) 10%, transparent)'
                                        : 'transparent';
                                }}
                            >
                                <span>{tag.name}</span>
                                {isSel && (
                                    <Check
                                        size={13}
                                        style={{
                                            color: 'var(--sn-accent)',
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {selected.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags
                        .filter((t) => selected.includes(t.id))
                        .map((tag) => (
                            <span
                                key={tag.id}
                                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                                style={{
                                    background:
                                        'color-mix(in oklch, var(--sn-accent) 12%, transparent)',
                                    color: 'var(--sn-accent)',
                                    border: '1px solid color-mix(in oklch, var(--sn-accent) 25%, transparent)',
                                }}
                            >
                                {tag.name}
                                <button
                                    type="button"
                                    onClick={() => toggle(tag.id)}
                                    className="opacity-60 transition-opacity hover:opacity-100"
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        ))}
                </div>
            )}

            <FieldError message={error} />
        </div>
    );
}

export default function ArticleCreateSheet({
    tags,
    open,
    onOpenChange,
    article,
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
                published_at: article.published_at ?? '',
            });
        }
    }, [article?.slug, open]); // eslint-disable-line react-hooks/exhaustive-deps

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

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (article) {
            patch(ArticleController.update.url({ article: article.slug }), {
                onSuccess: () => handleClose(false),
            });
        } else {
            post(ArticleController.store.url(), {
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
                    className="fixed top-4 right-4 bottom-4 z-50 flex flex-col rounded-2xl shadow-2xl transition ease-in-out outline-none data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:slide-in-from-right"
                    style={{
                        width: 'min(680px, calc(100vw - 32px))',
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                    }}
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
                        <div>
                            <p
                                className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                {article
                                    ? "// modifier l'article"
                                    : '// nouvel article'}
                            </p>
                            <h2
                                className="mt-0.5 text-[18px] font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {article
                                    ? "Modifier l'article"
                                    : 'Rédiger un article'}
                            </h2>
                        </div>
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
                                <div className="grid grid-cols-2 gap-3">
                                    <div
                                        className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
                                        style={{
                                            background: 'var(--sn-surface)',
                                            border: '1px solid var(--sn-border)',
                                        }}
                                        onClick={() =>
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
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        disabled={data.is_draft}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData('locale', loc);
                                                }}
                                                className="rounded-md px-4 py-1.5 text-[12.5px] font-semibold transition-all"
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
                                            className="w-full resize-none px-4 py-3 font-mono text-[13px] leading-relaxed focus:outline-none"
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
