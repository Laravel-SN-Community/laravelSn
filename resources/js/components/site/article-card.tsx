import { Link } from '@inertiajs/react';
import type { ArticleAuthor, ArticleTag } from '@/types/article';

interface ArticleCardProps {
    slug: string;
    title: string;
    excerpt: string;
    cover_url: string | null;
    locale: string;
    published_at: string | null;
    reading_time_minutes: number;
    author: ArticleAuthor;
    tags: ArticleTag[];
}

function tagTint(slug: string): string {
    const palette = ['var(--sn-500)', 'var(--sn-600)', 'var(--sn-700)'];
    let h = 0;

    for (const c of slug) {
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

export default function ArticleCard({
    slug,
    title,
    excerpt,
    cover_url,
    locale,
    published_at,
    reading_time_minutes,
    author,
    tags,
}: ArticleCardProps) {
    const firstTag = tags[0];
    const tint = firstTag ? tagTint(firstTag.slug) : 'var(--sn-600)';

    return (
        <Link
            href={`/articles/${slug}`}
            className="sn-card sn-card-hover block overflow-hidden sm:flex sm:flex-col"
        >
            {/* Desktop only: full-width cover (image or gradient placeholder) */}
            <div
                className="relative hidden aspect-[16/9] sm:block"
                style={
                    cover_url
                        ? {}
                        : {
                              background: `linear-gradient(135deg, ${tint}, var(--sn-500))`,
                          }
                }
            >
                {cover_url ? (
                    <img
                        src={cover_url}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <>
                        <div className="bg-sn-grid absolute inset-0 opacity-40" />
                        {firstTag && (
                            <div
                                className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.18em] uppercase"
                                style={{ color: 'rgba(255,255,255,.85)' }}
                            >
                                {firstTag.name}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Content — horizontal on mobile, stacked on desktop */}
            <div className="flex gap-3 p-4 sm:flex sm:flex-1 sm:flex-col sm:p-5">
                {/* Text content */}
                <div className="min-w-0 flex-1 sm:flex sm:flex-1 sm:flex-col">
                    <div className="mb-2 flex flex-wrap gap-2">
                        {tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag.id}
                                className="sn-badge sn-badge-primary"
                            >
                                #{tag.name}
                            </span>
                        ))}
                        <span className="sn-badge sn-badge-neutral">
                            {locale.toUpperCase()}
                        </span>
                    </div>

                    <div
                        className="truncate text-[17px] leading-snug font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {title}
                    </div>

                    <p
                        className="mt-2 text-[13.5px] leading-relaxed"
                        style={{
                            color: 'var(--sn-muted)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {excerpt}
                    </p>

                    <div
                        className="mt-3 flex items-center gap-2 text-[12px] sm:mt-auto sm:pt-3"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {author.avatar ? (
                            <img
                                src={author.avatar}
                                alt={author.name}
                                className="h-5 w-5 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <span
                                className="h-5 w-5 shrink-0 rounded-full"
                                style={{ background: tint }}
                            />
                        )}
                        {author.name}
                        {published_at && <> · {fmtDate(published_at)}</>} ·{' '}
                        {reading_time_minutes} min
                    </div>
                </div>

                {/* Mobile: cover thumbnail, shown only when cover_url exists */}
                {cover_url && (
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg sm:hidden">
                        <img
                            src={cover_url}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}
