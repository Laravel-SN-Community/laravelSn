import type { ArticleAuthor, ArticleTag } from '@/types/article';

interface ArticleCardProps {
    slug: string;
    title: string;
    excerpt: string;
    locale: string;
    published_at: string | null;
    reading_time_minutes: number;
    author: ArticleAuthor;
    tags: ArticleTag[];
}

function tagTint(slug: string): string {
    const palette = ['var(--sn-500)', 'var(--sn-600)', 'var(--sn-700)'];
    let h = 0;
    for (const c of slug) h = ((h * 31 + c.charCodeAt(0)) >>> 0);
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
    locale,
    published_at,
    reading_time_minutes,
    author,
    tags,
}: ArticleCardProps) {
    const firstTag = tags[0];
    const tint = firstTag ? tagTint(firstTag.slug) : 'var(--sn-600)';

    return (
        <a href={`/articles/${slug}`} className="sn-card sn-card-hover block overflow-hidden">
            {/* Cover */}
            <div
                className="relative aspect-[16/9]"
                style={{ background: `linear-gradient(135deg, ${tint}, var(--sn-500))` }}
            >
                <div className="bg-sn-grid absolute inset-0 opacity-40" />
                {firstTag && (
                    <div
                        className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.18em] uppercase"
                        style={{ color: 'rgba(255,255,255,.85)' }}
                    >
                        {firstTag.name}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-2 flex flex-wrap gap-2">
                    {tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="sn-badge sn-badge-primary">
                            #{tag.name}
                        </span>
                    ))}
                    <span className="sn-badge sn-badge-neutral">{locale.toUpperCase()}</span>
                </div>

                <div
                    className="text-[17px] leading-snug font-semibold tracking-tight"
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
                    className="mt-4 flex items-center gap-2 text-[12px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: tint }} />
                    {author.name}
                    {published_at && <> · {fmtDate(published_at)}</>}
                    {' '}· {reading_time_minutes} min
                </div>
            </div>
        </a>
    );
}
