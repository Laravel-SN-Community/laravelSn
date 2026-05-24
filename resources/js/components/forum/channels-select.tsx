import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ForumChannel } from '@/types';

export function ChannelsSelect({
    channels,
    selected,
    onChange,
    error,
}: {
    channels: ForumChannel[];
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
            onChange(selected.filter((c) => c !== id));
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
                        ? 'Sélectionner 1 à 3 channels…'
                        : `${selected.length} channel${selected.length > 1 ? 's' : ''} sélectionné${selected.length > 1 ? 's' : ''}`}
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
                    className="absolute top-full right-0 left-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-lg py-1 shadow-xl"
                    style={{
                        background: 'var(--sn-surface)',
                        border: '1px solid var(--sn-border)',
                    }}
                >
                    {channels.map((channel) => {
                        const isSel = selected.includes(channel.id);
                        const isOff = !isSel && selected.length >= 3;
                        const color = channel.color ?? 'var(--sn-accent)';

                        return (
                            <button
                                key={channel.id}
                                type="button"
                                onClick={() => !isOff && toggle(channel.id)}
                                className="flex w-full items-center justify-between px-3 py-2.5 text-[13px]"
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
                                <span className="flex items-center gap-2.5">
                                    <span
                                        className="h-2 w-2 shrink-0 rounded-full"
                                        style={{ background: color }}
                                    />
                                    <span>{channel.name}</span>
                                </span>
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
                    {channels
                        .filter((c) => selected.includes(c.id))
                        .map((channel) => {
                            const color = channel.color ?? 'var(--sn-accent)';

                            return (
                                <span
                                    key={channel.id}
                                    className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                                    style={{
                                        background: `color-mix(in oklch, ${color} 12%, transparent)`,
                                        color,
                                        border: `1px solid color-mix(in oklch, ${color} 25%, transparent)`,
                                    }}
                                >
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{ background: color }}
                                    />
                                    {channel.name}
                                    <button
                                        type="button"
                                        onClick={() => toggle(channel.id)}
                                        className="opacity-60 transition-opacity hover:opacity-100"
                                    >
                                        <X size={10} />
                                    </button>
                                </span>
                            );
                        })}
                </div>
            )}

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
