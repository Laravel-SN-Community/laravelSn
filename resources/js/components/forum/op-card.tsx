import { Link } from '@inertiajs/react';
import { Check, Lock, Pin } from 'lucide-react';
import { useInitials } from '@/hooks/use-initials';
import { authorTint, timeAgo } from '@/lib/forum';
import { toUrl } from '@/lib/utils';
import { show as channelShow } from '@/routes/forum/channels';
import type { ForumThreadFull } from '@/types';

export function OpCard({ thread }: { thread: ForumThreadFull }) {
    const isResolved = thread.solution_reply_id !== null;
    const getInitials = useInitials();

    return (
        <div
            className="overflow-hidden rounded-xl"
            style={{
                background: 'var(--sn-surface-2)',
                border: '1.5px solid var(--sn-border)',
                boxShadow:
                    '0 1px 0 0 var(--sn-border), 0 6px 20px -4px rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.06)',
            }}
        >
            <div className="px-6 pt-5 pb-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {thread.channels.map((c) => {
                        const color = c.color ?? 'var(--sn-accent)';

                        return (
                            <Link
                                key={c.id}
                                href={toUrl(channelShow(c.slug))}
                                className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10.5px] tracking-widest uppercase transition-opacity hover:opacity-80"
                                style={{
                                    background: `color-mix(in oklch, ${color} 14%, transparent)`,
                                    color,
                                    border: `1px solid color-mix(in oklch, ${color} 35%, transparent)`,
                                }}
                            >
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: color }}
                                />
                                {c.name}
                            </Link>
                        );
                    })}
                    {isResolved && (
                        <span
                            className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10.5px] tracking-widest uppercase"
                            style={{
                                background:
                                    'color-mix(in oklch, var(--sn-accent) 14%, transparent)',
                                color: 'var(--sn-accent)',
                            }}
                        >
                            <Check size={10} /> résolu
                        </span>
                    )}
                    {thread.is_pinned && (
                        <Pin size={11} style={{ color: 'var(--sn-muted)' }} />
                    )}
                    {thread.is_locked && (
                        <Lock size={11} style={{ color: 'var(--sn-muted)' }} />
                    )}
                </div>

                <div className="mb-3 flex items-center gap-2.5">
                    <div
                        className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full"
                        style={{
                            background: thread.author.avatar
                                ? 'transparent'
                                : authorTint(thread.author.id),
                        }}
                    >
                        {thread.author.avatar ? (
                            <img
                                src={thread.author.avatar}
                                alt={thread.author.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-white">
                                {getInitials(thread.author.name)}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <span
                            className="block truncate text-[13px] font-semibold"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            {thread.author.name}
                        </span>
                        <span
                            className="block font-mono text-[11px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            @{thread.author.username} ·{' '}
                            {timeAgo(thread.created_at)}
                        </span>
                    </div>
                </div>

                <h1
                    className="text-[18px] leading-[1.3] font-semibold tracking-tight lg:text-[20px]"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    {thread.title}
                </h1>
            </div>

            <div className="px-6 pb-5">
                <div
                    className="text-[14.5px] leading-[1.8] whitespace-pre-wrap"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    {thread.body}
                </div>
            </div>
        </div>
    );
}
