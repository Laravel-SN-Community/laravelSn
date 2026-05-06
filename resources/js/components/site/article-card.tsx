interface ArticleCardProps {
    slug: string;
    tag: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readMinutes: number;
    tint?: string;
}

export default function ArticleCard({
    slug,
    tag,
    title,
    excerpt,
    author,
    date,
    readMinutes,
    tint = 'var(--sn-700)',
}: ArticleCardProps) {
    return (
        <a
            href={`/articles/${slug}`}
            className="sn-card sn-card-hover block overflow-hidden"
        >
            {/* Cover */}
            <div
                className="relative aspect-[16/9]"
                style={{
                    background: `linear-gradient(135deg, ${tint}, var(--sn-500))`,
                }}
            >
                <div className="bg-sn-grid absolute inset-0 opacity-40" />
                <div
                    className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.18em] uppercase"
                    style={{ color: 'rgba(255,255,255,.85)' }}
                >
                    {tag}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-2 flex gap-2">
                    <span className="sn-badge sn-badge-primary">#{tag}</span>
                    <span className="sn-badge sn-badge-neutral">FR</span>
                </div>

                <div
                    className="text-[17px] leading-snug font-semibold tracking-tight"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    {title}
                </div>

                <p
                    className="mt-2 text-[13.5px] leading-relaxed"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    {excerpt}
                </p>

                <div
                    className="mt-4 flex items-center gap-2 text-[12px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <span
                        className="h-5 w-5 rounded-full"
                        style={{ background: tint }}
                    />
                    {author} · {date} · {readMinutes} min
                </div>
            </div>
        </a>
    );
}
