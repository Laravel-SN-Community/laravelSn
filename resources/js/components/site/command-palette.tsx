import {
    BookOpen,
    Calendar,
    Github,
    MessageCircle,
    Search,
    Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType } from 'react';

interface CommandItem {
    g: string;
    label: string;
    hint: string;
    Icon: ElementType;
    href: string;
}

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

const ALL_ITEMS: CommandItem[] = [
    { g: 'Navigation', label: 'Accueil', hint: '/', Icon: Sparkles, href: '/' },
    {
        g: 'Navigation',
        label: 'Articles',
        hint: '/articles',
        Icon: BookOpen,
        href: '/articles',
    },
    {
        g: 'Navigation',
        label: 'Forum',
        hint: '/forum',
        Icon: MessageCircle,
        href: '/forum',
    },
    {
        g: 'Navigation',
        label: 'Événements',
        hint: '/events',
        Icon: Calendar,
        href: '/events',
    },
    {
        g: 'Articles récents',
        label: 'Modèles sans N+1 : patterns Eloquent éprouvés',
        hint: '6 min · Aïssatou Diop',
        Icon: BookOpen,
        href: '/articles/n-plus-1',
    },
    {
        g: 'Articles récents',
        label: 'Queues & Horizon en production',
        hint: '9 min · Omar Sy',
        Icon: BookOpen,
        href: '/articles/horizon',
    },
    {
        g: 'Articles récents',
        label: 'Inertia v3 : les nouveautés',
        hint: '5 min · Mamadou F.',
        Icon: BookOpen,
        href: '/articles/inertia-v3',
    },
    {
        g: 'Événements',
        label: 'Meetup Dakar #09 — Filament',
        hint: '18 mai · 42/80 places',
        Icon: Calendar,
        href: '/events/meetup-09',
    },
    {
        g: 'Actions',
        label: 'Rejoindre le WhatsApp',
        hint: 'canal principal',
        Icon: MessageCircle,
        href: '/rejoindre',
    },
    {
        g: 'Actions',
        label: 'Discord Laravel Sénégal',
        hint: 'canal dev',
        Icon: MessageCircle,
        href: '/rejoindre',
    },
    {
        g: 'Actions',
        label: 'GitHub — laravel-sn',
        hint: 'repo communauté',
        Icon: Github,
        href: 'https://github.com/laravel-sn',
    },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [q, setQ] = useState('');
    const [cursor, setCursor] = useState(0);

    const filtered = useMemo(() => {
        if (!q.trim()) {
            return ALL_ITEMS;
        }

        const s = q.toLowerCase();

        return ALL_ITEMS.filter(
            (i) =>
                i.label.toLowerCase().includes(s) ||
                i.g.toLowerCase().includes(s),
        );
    }, [q]);

    const groups = useMemo(() => {
        const m = new Map<string, (CommandItem & { idx: number })[]>();
        filtered.forEach((item, idx) => {
            if (!m.has(item.g)) {
                m.set(item.g, []);
            }

            m.get(item.g)!.push({ ...item, idx });
        });

        return [...m.entries()];
    }, [filtered]);

    useEffect(() => {
        const id = setTimeout(() => inputRef.current?.focus(), 0);

        return () => clearTimeout(id);
    }, []);

    const onKey = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setCursor((c) => Math.min(filtered.length - 1, c + 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = filtered[cursor];

                if (item?.href) {
                    window.location.href = item.href;
                }

                onClose();
            }
        },
        [filtered, cursor, onClose],
    );

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Palette de commandes"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'rgba(12,20,18,.55)',
                    animation: 'sn-overlay-in .16s var(--sn-ease) both',
                }}
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="relative w-full max-w-[620px]"
                style={{ animation: 'sn-dialog-in .22s var(--sn-ease) both' }}
            >
                <div
                    className="overflow-hidden rounded-[14px]"
                    style={{
                        background: 'var(--sn-surface)',
                        border: '1px solid var(--sn-border)',
                        boxShadow: 'var(--sn-shadow-lg)',
                    }}
                >
                    {/* Search input */}
                    <div
                        className="flex h-12 items-center gap-2.5 border-b px-4"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        <Search
                            size={16}
                            style={{ color: 'var(--sn-muted)' }}
                        />
                        <input
                            ref={inputRef}
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value);
                                setCursor(0);
                            }}
                            onKeyDown={onKey}
                            placeholder="Chercher un article, un événement, une action…"
                            className="flex-1 bg-transparent text-[15px] outline-none"
                            style={{ color: 'var(--sn-fg)' }}
                        />
                        <span className="sn-badge sn-badge-neutral">esc</span>
                    </div>

                    {/* Results */}
                    <div className="no-scrollbar max-h-[58vh] overflow-auto py-2">
                        {filtered.length === 0 && (
                            <div
                                className="px-5 py-10 text-center text-[14px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Aucun résultat pour{' '}
                                <span
                                    className="font-mono"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {q}
                                </span>
                            </div>
                        )}
                        {groups.map(([group, items]) => (
                            <div key={group} className="mb-1">
                                <div
                                    className="px-4 py-1.5 font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {group}
                                </div>
                                {items.map((item) => {
                                    const selected = cursor === item.idx;

                                    return (
                                        <button
                                            key={item.idx}
                                            onMouseEnter={() =>
                                                setCursor(item.idx)
                                            }
                                            onClick={() => {
                                                window.location.href =
                                                    item.href;
                                                onClose();
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2 text-left"
                                            style={{
                                                background: selected
                                                    ? 'var(--sn-surface-2)'
                                                    : 'transparent',
                                            }}
                                        >
                                            <span
                                                className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                                                style={{
                                                    background:
                                                        'var(--sn-surface-2)',
                                                    color: 'var(--sn-muted)',
                                                }}
                                            >
                                                <item.Icon size={14} />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <div
                                                    className="truncate text-[14px]"
                                                    style={{
                                                        color: 'var(--sn-fg)',
                                                    }}
                                                >
                                                    {item.label}
                                                </div>
                                                <div
                                                    className="truncate text-[12px]"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                >
                                                    {item.hint}
                                                </div>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                        className="flex h-9 items-center justify-between border-t px-4 font-mono text-[11.5px]"
                        style={{
                            borderColor: 'var(--sn-border)',
                            color: 'var(--sn-muted)',
                        }}
                    >
                        <span>↑↓ naviguer · ↵ ouvrir · esc fermer</span>
                        <span>Cmd + K</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
