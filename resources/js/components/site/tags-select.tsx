import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { ArticleTag } from '@/types/article';

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
    tags: ArticleTag[];
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

export { TagsSelect };
