import { Head, Link, usePage } from '@inertiajs/react';
import { Github, Globe, MapPin, Twitter } from 'lucide-react';
import type { ArticleSummary } from '@/types/article';

type UserProfile = {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    github_handle: string | null;
    twitter_handle: string | null;
    website_url: string | null;
    created_at: string;
};

function memberTint(username: string): string {
    const palette = ['#0f7b4d', '#188a5c', '#0b6640', '#3ea777'];
    let h = 0;

    for (const c of username) {
        h = (h * 31 + c.charCodeAt(0)) >>> 0;
    }

    return palette[h % palette.length];
}

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function fmtJoined(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
    });
}

export default function MembreShow() {
    const { user, articles } = usePage().props as {
        user: UserProfile;
        articles: ArticleSummary[];
    };

    const tint = memberTint(user.username ?? user.name);
    const initials = user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <Head title={`@${user.username} — Laravel Sénégal`} />

            <div className="mx-auto max-w-[1300px] px-6 pt-6 pb-16 lg:px-10">
                {/* Breadcrumb */}
                <div
                    className="mb-8 flex items-center gap-2 font-mono text-[11.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <Link href="/" className="hover:underline">
                        Accueil
                    </Link>
                    <span>/</span>
                    <span style={{ color: 'var(--sn-fg)' }}>
                        @{user.username}
                    </span>
                </div>

                <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
                    {/* Left — profile */}
                    <div>
                        <div className="lg:sticky lg:top-24">
                            <div className="flex justify-center">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-28 w-28 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex h-28 w-28 items-center justify-center rounded-full font-mono text-[28px] font-semibold"
                                        style={{
                                            background: tint,
                                            color: '#fff',
                                        }}
                                    >
                                        {initials}
                                    </div>
                                )}
                            </div>

                            <h1
                                className="mt-4 text-[28px] font-semibold tracking-[-0.02em]"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {user.name}
                            </h1>

                            <div
                                className="mt-0.5 font-mono text-[13px]"
                                style={{ color: 'var(--sn-accent)' }}
                            >
                                @{user.username}
                            </div>

                            {user.location && (
                                <div
                                    className="mt-1.5 flex items-center gap-1.5 font-mono text-[12.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    <MapPin size={12} />
                                    {user.location}
                                </div>
                            )}

                            {user.bio && (
                                <p
                                    className="mt-4 text-[14px] leading-relaxed"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {user.bio}
                                </p>
                            )}

                            {/* Social links */}
                            {(user.github_handle ||
                                user.twitter_handle ||
                                user.website_url) && (
                                <div className="mt-4 flex items-center gap-1">
                                    {user.github_handle && (
                                        <a
                                            href={`https://github.com/${user.github_handle}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={user.github_handle}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
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
                                            <Github size={18} />
                                        </a>
                                    )}
                                    {user.twitter_handle && (
                                        <a
                                            href={`https://twitter.com/${user.twitter_handle}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`@${user.twitter_handle}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
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
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {user.website_url && (
                                        <a
                                            href={user.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Site web"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
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
                                            <Globe size={18} />
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div
                                    className="rounded-xl p-4 text-center"
                                    style={{
                                        background: 'var(--sn-surface)',
                                        border: '1px solid var(--sn-border)',
                                    }}
                                >
                                    <div
                                        className="text-[26px] font-semibold tracking-tight"
                                        style={{ color: 'var(--sn-fg)' }}
                                    >
                                        {articles.length}
                                    </div>
                                    <div
                                        className="mt-0.5 font-mono text-[11px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        articles
                                    </div>
                                </div>
                                <div
                                    className="rounded-xl p-4 text-center"
                                    style={{
                                        background: 'var(--sn-surface)',
                                        border: '1px solid var(--sn-border)',
                                    }}
                                >
                                    <div
                                        className="text-[26px] font-semibold tracking-tight"
                                        style={{ color: 'var(--sn-fg)' }}
                                    >
                                        {articles
                                            .reduce(
                                                (s, a) => s + a.views_count,
                                                0,
                                            )
                                            .toLocaleString('fr-FR')}
                                    </div>
                                    <div
                                        className="mt-0.5 font-mono text-[11px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        vues
                                    </div>
                                </div>
                            </div>

                            <div
                                className="mt-4 font-mono text-[11px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Membre depuis {fmtJoined(user.created_at)}
                            </div>
                        </div>
                    </div>

                    {/* Right — articles */}
                    <div>
                        {articles.length > 0 ? (
                            <>
                                <div
                                    className="mb-5 font-mono text-[11px] tracking-[0.2em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    // articles publiés
                                </div>
                                <div className="space-y-4">
                                    {articles.map((a) => (
                                        <Link
                                            key={a.slug}
                                            href={`/articles/${a.slug}`}
                                            className="block rounded-xl p-5 transition-all hover:-translate-y-0.5"
                                            style={{
                                                background: 'var(--sn-surface)',
                                                border: '1px solid var(--sn-border)',
                                            }}
                                        >
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                {a.tags
                                                    .slice(0, 2)
                                                    .map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="sn-badge sn-badge-primary"
                                                        >
                                                            #{tag.name}
                                                        </span>
                                                    ))}
                                                <span
                                                    className="font-mono text-[11px]"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                >
                                                    {a.published_at
                                                        ? fmtDate(
                                                              a.published_at,
                                                          )
                                                        : ''}{' '}
                                                    · {a.reading_time_minutes}{' '}
                                                    min ·{' '}
                                                    {a.views_count.toLocaleString(
                                                        'fr-FR',
                                                    )}{' '}
                                                    vues
                                                </span>
                                            </div>
                                            <div
                                                className="text-[17px] font-semibold tracking-tight"
                                                style={{
                                                    color: 'var(--sn-fg)',
                                                }}
                                            >
                                                {a.title}
                                            </div>
                                            <p
                                                className="mt-2 text-[13.5px] leading-relaxed"
                                                style={{
                                                    color: 'var(--sn-muted)',
                                                }}
                                            >
                                                {a.excerpt}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div
                                className="rounded-xl p-10 text-center"
                                style={{
                                    background: 'var(--sn-surface)',
                                    border: '1px solid var(--sn-border)',
                                }}
                            >
                                <div
                                    className="font-mono text-[12px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    // aucun article publié pour l'instant
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
