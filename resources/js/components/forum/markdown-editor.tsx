import {
    Bold,
    Code,
    Code2,
    Italic,
    Link,
    List,
    ListOrdered,
    Quote,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { renderMarkdown } from '@/lib/forum';

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

export function MarkdownEditor({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (value: string) => void;
    error?: string | undefined;
}) {
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

    function insertMarkdown(before: string, after: string) {
        const ta = bodyRef.current;

        if (!ta) {
            return;
        }

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const sel = value.substring(start, end);
        onChange(
            value.substring(0, start) +
                before +
                sel +
                after +
                value.substring(end),
        );
        requestAnimationFrame(() => {
            ta.focus();
            ta.setSelectionRange(
                start + before.length,
                start + before.length + sel.length,
            );
        });
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
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
        <div>
            <div className="flex items-end justify-between">
                <div className="mb-1.5 flex items-center gap-1.5">
                    <span
                        className="text-[12.5px] font-medium"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        Contenu
                    </span>
                    <span
                        className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium"
                        style={{
                            background:
                                'color-mix(in oklch, var(--sn-accent) 15%, transparent)',
                            color: 'var(--sn-accent)',
                        }}
                    >
                        Requis
                    </span>
                </div>
                <div
                    className="flex"
                    style={{
                        marginBottom: '-1px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {(['write', 'preview'] as const).map((t) => (
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
                            {t === 'write' ? 'Rédiger' : 'Aperçu'}
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="overflow-hidden rounded-tl-xl rounded-b-xl"
                style={{
                    border: `1px solid ${error ? 'var(--destructive)' : 'var(--sn-border)'}`,
                }}
            >
                {tab === 'write' && (
                    <div
                        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
                        style={{
                            background: 'var(--sn-surface)',
                            borderBottom: '1px solid var(--sn-border)',
                        }}
                    >
                        {TOOLBAR.map((item, i) =>
                            item.type === 'sep' ? (
                                <span
                                    key={`sep-${i}`}
                                    className="mx-1 h-4 w-px"
                                    style={{ background: 'var(--sn-border)' }}
                                />
                            ) : (
                                <button
                                    key={item.label}
                                    type="button"
                                    title={item.label}
                                    onClick={() =>
                                        insertMarkdown(item.before, item.after)
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                                    style={{ color: 'var(--sn-muted)' }}
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
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            "Mon code actuel :\n\n```php\n$users = User::all();\n```\n\nCe que j'ai essayé :\n- ..."
                        }
                        className="w-full resize-none px-4 py-3 text-[13px] leading-relaxed focus:outline-none"
                        style={{
                            background: 'var(--sn-bg)',
                            color: 'var(--sn-fg)',
                            height: '260px',
                            display: 'block',
                        }}
                    />
                ) : (
                    <div
                        className="overflow-auto px-5 py-4 text-[13.5px] leading-relaxed"
                        style={{
                            background: 'var(--sn-bg)',
                            color: 'var(--sn-fg)',
                            height: '260px',
                        }}
                        dangerouslySetInnerHTML={{
                            __html:
                                renderMarkdown(value) ||
                                '<p style="color:var(--sn-muted);font-style:italic;font-size:13px;margin:0">Aucun contenu à prévisualiser…</p>',
                        }}
                    />
                )}

                <div
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{
                        background: 'var(--sn-surface)',
                        borderTop: '1px solid var(--sn-border)',
                    }}
                >
                    <span
                        className="font-mono text-[11px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {wordCount > 0
                            ? `${wordCount} mots`
                            : 'Markdown supporté — min. 20 caractères'}
                    </span>
                    <span
                        className="font-mono text-[11px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {tab === 'write' ? '⌘B ⌘I ⌘K' : 'Aperçu'}
                    </span>
                </div>
            </div>

            {error && (
                <p
                    className="mt-1 text-[12px]"
                    style={{ color: 'var(--destructive)' }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
