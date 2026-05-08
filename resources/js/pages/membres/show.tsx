import { Head, Link, usePage } from '@inertiajs/react';
import { ARTICLES, MEMBERS } from '@/data/community';

export default function Membre() {
    const { slug } = usePage().props as unknown as { slug: string };
    const member = MEMBERS.find((m) => m.slug === slug) ?? MEMBERS[0];
    const memberArticles = ARTICLES.filter((a) => a.authorSlug === member.slug);

    return (
        <>
            <Head title={`${member.name} — Laravel Sénégal`} />

            <div className="mx-auto max-w-[1100px] px-6 pt-6 pb-16 lg:px-10">
                {/* Breadcrumb */}
                <div
                    className="mb-8 flex items-center gap-2 font-mono text-[11.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <Link href="/" className="hover:underline">
                        Accueil
                    </Link>
                    <span>/</span>
                    <Link href="/membres" className="hover:underline">
                        Membres
                    </Link>
                    <span>/</span>
                    <span style={{ color: 'var(--sn-fg)' }}>{member.name}</span>
                </div>

                <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
                    {/* Left profile column */}
                    <div>
                        <div className="lg:sticky lg:top-24">
                            <div
                                className="flex h-28 w-28 items-center justify-center rounded-full font-mono text-[28px] font-semibold"
                                style={{ background: member.tint, color: '#fff' }}
                            >
                                {member.init}
                            </div>

                            <h1
                                className="mt-4 text-[28px] font-semibold tracking-[-0.02em]"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {member.name}
                            </h1>

                            <div
                                className="mt-1 font-mono text-[13px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                {member.role} · {member.company} · {member.city}
                            </div>

                            {member.bio && (
                                <p
                                    className="mt-4 text-[14px] leading-relaxed"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {member.bio}
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {member.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded px-2 py-0.5 font-mono text-[11px]"
                                        style={{
                                            background: 'var(--sn-surface-2)',
                                            color: 'var(--sn-muted)',
                                            border: '1px solid var(--sn-border)',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {member.github && (
                                    <a
                                        href={`https://github.com/${member.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sn-btn sn-btn-ghost sn-btn-sm"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {member.site && (
                                    <a
                                        href={`https://${member.site}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sn-btn sn-btn-ghost sn-btn-sm"
                                    >
                                        Site
                                    </a>
                                )}
                            </div>

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
                                        {member.articles}
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
                                        {member.events}
                                    </div>
                                    <div
                                        className="mt-0.5 font-mono text-[11px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        évènements
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right content column */}
                    <div>
                        {memberArticles.length > 0 && (
                            <>
                                <div
                                    className="mb-5 font-mono text-[11px] tracking-[0.2em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    // articles publiés
                                </div>
                                <div className="space-y-4">
                                    {memberArticles.map((a) => (
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
                                                <span className="sn-badge sn-badge-primary">
                                                    #{a.tag}
                                                </span>
                                                <span
                                                    className="font-mono text-[11px]"
                                                    style={{ color: 'var(--sn-muted)' }}
                                                >
                                                    {a.date} · {a.readMinutes} min
                                                </span>
                                            </div>
                                            <div
                                                className="text-[17px] font-semibold tracking-tight"
                                                style={{ color: 'var(--sn-fg)' }}
                                            >
                                                {a.title}
                                            </div>
                                            <p
                                                className="mt-2 text-[13.5px] leading-relaxed"
                                                style={{ color: 'var(--sn-muted)' }}
                                            >
                                                {a.excerpt}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        {memberArticles.length === 0 && (
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
