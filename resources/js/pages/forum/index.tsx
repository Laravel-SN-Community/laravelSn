import { Head, Link } from '@inertiajs/react';
import { Check, Eye, MessageSquare, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    FORUM_CHANNELS,
    FORUM_TAG_COLORS,
    FORUM_THREADS,
    MEMBERS,
} from '@/data/community';
import { useInitials } from '@/hooks/use-initials';

function ChannelIcon({ k }: { k: string }) {
    const props = {
        width: 14,
        height: 14,
        viewBox: '0 0 24 24',
        fill: 'none' as const,
        stroke: 'currentColor' as const,
        strokeWidth: 1.75,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    if (k === 'list') {
        return (
            <svg {...props}>
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        );
    }

    if (k === 'check') {
        return (
            <svg {...props}>
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
    }

    if (k === 'x') {
        return (
            <svg {...props}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        );
    }

    if (k === 'msg') {
        return (
            <svg {...props}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        );
    }

    if (k === 'heart') {
        return (
            <svg {...props}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        );
    }

    return null;
}

function ThreadCard({ thread }: { thread: (typeof FORUM_THREADS)[0] }) {
    const getInitials = useInitials();
    const author = MEMBERS.find((m) => m.slug === thread.authorSlug) ?? {
        init: getInitials(thread.author),
        tint: '#0f7b4d',
    };

    return (
        <Link
            href={`/forum/${thread.slug}`}
            className="block rounded-xl p-5 transition-colors"
            style={{
                background: 'var(--sn-surface)',
                border: '1px solid var(--sn-border)',
            }}
        >
            {/* Tags */}
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
                {thread.tags.map((tag) => {
                    const cfg =
                        FORUM_TAG_COLORS[tag] ?? FORUM_TAG_COLORS['divers'];

                    return (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10.5px] tracking-[0.1em] uppercase"
                            style={{
                                background: `color-mix(in oklch, ${cfg.color} 14%, transparent)`,
                                color: cfg.color,
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ background: cfg.color }}
                            />
                            {tag}
                        </span>
                    );
                })}
                {thread.resolved && (
                    <span
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10.5px] tracking-[0.1em] uppercase"
                        style={{
                            background:
                                'color-mix(in oklch, var(--sn-accent) 14%, transparent)',
                            color: 'var(--sn-accent)',
                        }}
                    >
                        <Check size={10} /> résolu
                    </span>
                )}
            </div>

            {/* Title */}
            <div
                className="text-[16.5px] leading-snug font-semibold tracking-tight"
                style={{ color: 'var(--sn-fg)' }}
            >
                {thread.title}
            </div>

            {/* Excerpt */}
            <p
                className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed"
                style={{ color: 'var(--sn-muted)' }}
            >
                {thread.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div
                    className="flex items-center gap-2.5 text-[12.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <span
                        className="grid h-6 w-6 place-items-center rounded-full font-mono text-[10px]"
                        style={{ background: author.tint, color: '#fff' }}
                    >
                        {author.init}
                    </span>
                    <span>
                        <span style={{ color: 'var(--sn-fg)' }}>
                            @{thread.author}
                        </span>{' '}
                        a posé{' '}
                        <span className="font-mono">· {thread.when}</span>
                    </span>
                </div>
                <div
                    className="flex items-center gap-4 font-mono text-[12px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <span className="flex items-center gap-1.5">
                        <MessageSquare size={13} /> {thread.replies}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Eye size={13} /> {thread.views}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function Forum() {
    const [channel, setChannel] = useState('tous');
    const [lang, setLang] = useState('fr');
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('Toutes');

    const filtered = useMemo(
        () =>
            FORUM_THREADS.filter((t) => {
                if (channel === 'resolu' && !t.resolved) {
                    return false;
                }

                if (channel === 'non-resolu' && t.resolved) {
                    return false;
                }

                if (channel === 'sans-rep' && t.replies > 0) {
                    return false;
                }

                if (channel === 'populaire' && t.views < 100) {
                    return false;
                }

                if (q && !t.title.toLowerCase().includes(q.toLowerCase())) {
                    return false;
                }

                return true;
            }),
        [channel, q],
    );

    return (
        <>
            <Head title="Forum — Laravel Sénégal" />

            <div className="mx-auto max-w-[1400px] px-6 pt-10 pb-16 lg:px-10">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1
                            className="mt-2 text-[34px] font-semibold tracking-tight"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            Discussions de la communauté
                        </h1>
                        <p
                            className="mt-2 max-w-[60ch] text-[16px] leading-relaxed"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Pose ta question, partage un retour d'expérience, ou
                            aide quelqu'un.
                        </p>
                    </div>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
                    {/* Sidebar */}
                    <aside className="order-last space-y-2 lg:sticky lg:top-20 lg:order-first">
                        <button className="sn-btn sn-btn-primary mb-4 w-full justify-center">
                            Nouveau sujet
                        </button>
                        {FORUM_CHANNELS.map((c) => (
                            <button
                                key={c.slug}
                                onClick={() => setChannel(c.slug)}
                                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13.5px] transition-colors"
                                style={{
                                    background:
                                        channel === c.slug
                                            ? 'var(--sn-surface-2)'
                                            : 'transparent',
                                    color:
                                        channel === c.slug
                                            ? 'var(--sn-fg)'
                                            : 'var(--sn-muted)',
                                    fontWeight: channel === c.slug ? 600 : 500,
                                }}
                            >
                                <ChannelIcon k={c.icon} />
                                <span>{c.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Main */}
                    <div>
                        {/* Toolbar */}
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="rounded-md px-3 py-2 font-mono text-[13px]"
                                style={{
                                    background: 'var(--sn-surface)',
                                    border: '1px solid var(--sn-border)',
                                    color: 'var(--sn-fg)',
                                }}
                            >
                                <option>Toutes</option>
                                <option>Récents</option>
                                <option>Plus actifs</option>
                                <option>Plus vus</option>
                            </select>

                            <div
                                className="flex overflow-hidden rounded-md"
                                style={{ border: '1px solid var(--sn-border)' }}
                            >
                                {['fr', 'en'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className="px-3 py-2 font-mono text-[12.5px] uppercase transition-colors"
                                        style={{
                                            background:
                                                lang === l
                                                    ? 'var(--sn-accent)'
                                                    : 'var(--sn-surface)',
                                            color:
                                                lang === l
                                                    ? 'var(--sn-accent-fg)'
                                                    : 'var(--sn-muted)',
                                        }}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>

                            <div className="relative ml-auto w-full max-w-[280px]">
                                <span
                                    className="absolute top-1/2 left-3 -translate-y-1/2"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    <Search size={14} />
                                </span>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Rechercher un sujet"
                                    className="w-full rounded-md py-2 pr-3 pl-9 text-[13.5px]"
                                    style={{
                                        background: 'var(--sn-surface)',
                                        border: '1px solid var(--sn-border)',
                                        color: 'var(--sn-fg)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Threads */}
                        <div className="space-y-3">
                            {filtered.map((t) => (
                                <ThreadCard key={t.slug} thread={t} />
                            ))}
                            {filtered.length === 0 && (
                                <div
                                    className="rounded-xl p-12 text-center"
                                    style={{
                                        background: 'var(--sn-surface)',
                                        border: '1px solid var(--sn-border)',
                                    }}
                                >
                                    <div
                                        className="text-[14px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        Aucun sujet ne correspond.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
