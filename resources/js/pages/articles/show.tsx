import { Head, Link, usePage } from '@inertiajs/react';
import { Github, Link2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ArticleCard from '@/components/site/article-card';
import { useInitials } from '@/hooks/use-initials';
import type { ArticleFull, ArticleSummary } from '@/types/article';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function extractToc(body: string): { id: string; label: string }[] {
    return [...body.matchAll(/^## (.+)$/gm)].map((m) => ({
        id: slugify(m[1]),
        label: m[1],
    }));
}

function renderBody(raw: string): string {
    const stash: string[] = [];
    const ph = (html: string) => {
        const id = `%%${stash.length}%%`;
        stash.push(html);

        return id;
    };

    let out = raw
        .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code) =>
            ph(
                `<pre><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()}</code></pre>`,
            ),
        )
        .replace(/`([^`\n]+?)`/g, (_, c) =>
            ph(
                `<code>${c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`,
            ),
        )
        .replace(/^## (.+)$/gm, (_, t) =>
            ph(`<h2 id="${slugify(t)}">${t}</h2>`),
        )
        .replace(/^### (.+)$/gm, (_, t) => ph(`<h3>${t}</h3>`))
        .replace(/^> (.+)$/gm, (_, t) => ph(`<blockquote>${t}</blockquote>`));

    out = out
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    out = out
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/^[-*] (.+)$/gm, '<li>$1</li>');

    stash.forEach((html, i) => {
        out = out.replace(`%%${i}%%`, html);
    });

    return out
        .split(/\n{2,}/)
        .map((para) => {
            const p = para.trim();

            if (!p) {
                return '';
            }

            if (/^<(h[1-6]|pre|blockquote)/.test(p)) {
                return p;
            }

            if (p.includes('<li>')) {
                return `<ul>${p.replace(/\n/g, '')}</ul>`;
            }

            return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
        })
        .filter(Boolean)
        .join('\n');
}

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function tagTint(slug: string): string {
    const palette = ['var(--sn-500)', 'var(--sn-600)', 'var(--sn-700)'];
    let h = 0;

    for (const c of slug) {
        h = (h * 31 + c.charCodeAt(0)) >>> 0;
    }

    return palette[h % palette.length];
}

function Comments() {
    const [list, setList] = useState([
        {
            id: 1,
            author: 'Khady Ndiaye',
            init: 'KN',
            tint: '#3ea777',
            when: 'il y a 2h',
            body: 'Excellent article 👏 Merci pour le partage !',
        },
        {
            id: 2,
            author: 'Ibrahima Ba',
            init: 'IB',
            tint: '#0f7b4d',
            when: 'il y a 5h',
            body: 'Très utile, je vais appliquer ça sur mon prochain projet.',
        },
    ]);
    const [val, setVal] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!val.trim()) {
            return;
        }

        setList((l) => [
            ...l,
            {
                id: Date.now(),
                author: 'Toi',
                init: 'TO',
                tint: 'var(--sn-accent)',
                when: "à l'instant",
                body: val,
            },
        ]);
        setVal('');
    };

    return (
        <div className="mt-12">
            <h3
                className="mb-4 text-[20px] font-semibold tracking-tight"
                style={{ color: 'var(--sn-fg)' }}
            >
                Commentaires · {list.length}
            </h3>

            <form onSubmit={submit} className="sn-card mb-5 p-4">
                <textarea
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    rows={3}
                    placeholder="Partage ton retour, ton expérience, ta question…"
                    className="w-full rounded-md px-3 py-2.5 text-[14px] outline-none"
                    style={{
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                        color: 'var(--sn-fg)',
                        resize: 'vertical',
                    }}
                />
                <div className="mt-3 flex items-center justify-between">
                    <span
                        className="font-mono text-[11.5px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        supporte <code>markdown</code> basique
                    </span>
                    <button
                        className="sn-btn sn-btn-primary sn-btn-sm"
                        type="submit"
                    >
                        Publier →
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                {list.map((c) => (
                    <div key={c.id} className="sn-card p-5">
                        <div className="flex items-center gap-3">
                            <span
                                className="grid h-9 w-9 place-items-center rounded-full font-mono text-[12px]"
                                style={{ background: c.tint, color: '#fff' }}
                            >
                                {c.init}
                            </span>
                            <div className="flex-1">
                                <div
                                    className="text-[14px] font-medium"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {c.author}
                                </div>
                                <div
                                    className="font-mono text-[11px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {c.when}
                                </div>
                            </div>
                            <button className="sn-btn sn-btn-ghost sn-btn-sm font-mono text-[11px]">
                                répondre
                            </button>
                        </div>
                        <p
                            className="mt-3 text-[14px] leading-relaxed"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            {c.body}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ArticleShow() {
    const { article, relatedArticles } = usePage().props as unknown as {
        article: ArticleFull;
        relatedArticles: ArticleSummary[];
    };

    const getInitials = useInitials();
    const toc = useMemo(() => extractToc(article.body), [article.body]);
    const bodyHtml = useMemo(() => renderBody(article.body), [article.body]);
    const firstTag = article.tags[0];
    const tint = firstTag ? tagTint(firstTag.slug) : 'var(--sn-600)';

    const [reactions, setReactions] = useState({
        up: article.likes_count,
        heart: 0,
        fire: 0,
    });
    const [saved, setSaved] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        if (toc.length === 0) {
            return;
        }

        const handler = () => {
            let current = toc[0]?.id ?? '';

            for (const { id } of toc) {
                const el = document.getElementById(id);

                if (el && el.getBoundingClientRect().top < 140) {
                    current = id;
                }
            }

            setActiveSection(current);
        };
        window.addEventListener('scroll', handler, { passive: true });
        handler();

        return () => window.removeEventListener('scroll', handler);
    }, [toc]);

    return (
        <>
            <Head title={`${article.title} — Laravel Sénégal`} />

            {/* Breadcrumb */}
            <div
                className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 pt-6 text-[12px] lg:px-10"
                style={{ color: 'var(--sn-muted)' }}
            >
                <Link href="/" className="hover:underline">
                    Accueil
                </Link>
                <span>/</span>
                <Link href="/articles" className="hover:underline">
                    Articles
                </Link>
                <span>/</span>
                <span style={{ color: 'var(--sn-fg)' }}>{article.title}</span>
            </div>

            {/* Content */}
            <article className="mx-auto grid max-w-[1400px] gap-10 px-6 pt-6 pb-16 lg:grid-cols-12 lg:px-10">
                {/* Main column */}
                <div className="min-w-0 lg:col-span-8">
                    {/* Tags + meta */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="sn-badge sn-badge-primary"
                            >
                                #{tag.name}
                            </span>
                        ))}
                        <span className="sn-badge sn-badge-neutral">
                            {article.locale.toUpperCase()}
                        </span>
                        <span className="sn-badge sn-badge-neutral">
                            {article.reading_time_minutes} min de lecture
                        </span>
                    </div>

                    <h1
                        className="text-[38px] leading-[1.08] font-semibold tracking-[-0.025em] lg:text-[52px]"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {article.title}
                    </h1>

                    <p
                        className="mt-5 max-w-[60ch] text-[18px] leading-[1.6]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {article.excerpt}
                    </p>

                    {/* Author strip */}
                    <div
                        className="mt-8 flex items-center gap-4 border-b pb-8"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        <Link
                            href={`/@${article.author.username}`}
                            className="flex items-center gap-3"
                        >
                            {article.author.avatar ? (
                                <img
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <span
                                    className="grid h-8 w-8 place-items-center rounded-full font-mono text-[11px]"
                                    style={{ background: tint, color: '#fff' }}
                                >
                                    {getInitials(article.author.name)}
                                </span>
                            )}
                            <div
                                className="text-[14px] font-medium"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {article.author.name}
                            </div>
                        </Link>
                        {article.published_at && (
                            <div
                                className="ml-auto text-right text-[12px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                <div>{fmtDate(article.published_at)}</div>
                                {new Date(article.updated_at).getTime() -
                                    new Date(article.published_at).getTime() >
                                    86_400_000 && (
                                    <div
                                        className="mt-0.5"
                                        style={{ color: 'var(--sn-accent)' }}
                                    >
                                        Mis à jour le{' '}
                                        {fmtDate(article.updated_at)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hero */}
                    <div
                        className="relative mt-8 overflow-hidden rounded-xl"
                        style={{
                            aspectRatio: '16/8',
                            background: `linear-gradient(135deg, ${tint}, var(--sn-500))`,
                        }}
                    >
                        <div className="bg-sn-grid absolute inset-0 opacity-30" />
                        {firstTag && (
                            <div
                                className="absolute bottom-6 left-6 font-mono text-[13px]"
                                style={{ color: 'rgba(255,255,255,.85)' }}
                            >
                                #{firstTag.name}
                                {article.published_at && (
                                    <> · {article.published_at.slice(0, 10)}</>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Article body */}
                    <style>{`
                        .article-body h2 { font-size:28px; font-weight:600; letter-spacing:-0.015em; margin:56px 0 14px; scroll-margin-top:96px; color:var(--sn-fg); }
                        .article-body h3 { font-size:21px; font-weight:600; letter-spacing:-0.01em; margin:32px 0 10px; color:var(--sn-fg); }
                        .article-body p  { font-size:17px; line-height:1.75; margin:18px 0; color:var(--sn-fg); }
                        .article-body ul { font-size:17px; line-height:1.75; margin:18px 0 18px 24px; list-style:disc; }
                        .article-body ul li { margin:6px 0; color:var(--sn-fg); }
                        .article-body strong { font-weight:600; }
                        .article-body code { font-family:var(--font-mono); font-size:13.5px; padding:1.5px 6px; background:var(--sn-surface-2); border-radius:4px; color:var(--sn-accent); }
                        .article-body pre { font-family:var(--font-mono); font-size:13px; line-height:1.7; padding:22px; background:#0d1411; color:#e6edf3; border:1px solid var(--sn-border); border-radius:10px; overflow-x:auto; margin:28px 0; }
                        .article-body pre code { background:transparent; border:0; padding:0; color:inherit; }
                        .article-body blockquote { margin:28px 0; padding:8px 22px; border-left:3px solid var(--sn-accent); font-style:italic; font-size:17px; color:var(--sn-muted); }
                    `}</style>
                    <div
                        className="article-body mt-10"
                        dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />

                    {/* Reactions */}
                    <div
                        className="mt-10 flex flex-wrap items-center gap-3 border-b pb-8"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        <button
                            onClick={() =>
                                setReactions((r) => ({ ...r, up: r.up + 1 }))
                            }
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                        >
                            👍 {reactions.up}
                        </button>
                        <button
                            onClick={() =>
                                setReactions((r) => ({
                                    ...r,
                                    heart: r.heart + 1,
                                }))
                            }
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                        >
                            ❤️ {reactions.heart}
                        </button>
                        <button
                            onClick={() =>
                                setReactions((r) => ({
                                    ...r,
                                    fire: r.fire + 1,
                                }))
                            }
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                        >
                            🔥 {reactions.fire}
                        </button>
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => setSaved((s) => !s)}
                                className="sn-btn sn-btn-secondary sn-btn-sm"
                            >
                                {saved ? '★ Sauvegardé' : '☆ Sauvegarder'}
                            </button>
                            <button className="sn-btn sn-btn-secondary sn-btn-sm">
                                <Link2 size={13} /> Copier le lien
                            </button>
                        </div>
                    </div>

                    {/* Author box */}
                    <div className="sn-card mt-10 flex gap-5 p-6">
                        <Link
                            href={`/@${article.author.username}`}
                            className="shrink-0"
                        >
                            {article.author.avatar ? (
                                <img
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                <span
                                    className="grid h-16 w-16 place-items-center rounded-full font-mono text-[18px]"
                                    style={{ background: tint, color: '#fff' }}
                                >
                                    {getInitials(article.author.name)}
                                </span>
                            )}
                        </Link>
                        <div className="min-w-0 flex-1">
                            <div
                                className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                écrit par
                            </div>
                            <Link
                                href={`/@${article.author.username}`}
                                className="mt-0.5 block text-[18px] font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {article.author.name}
                            </Link>
                            {article.author.location && (
                                <div
                                    className="mt-0.5 text-[13.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {article.author.location}
                                </div>
                            )}
                            {article.author.bio && (
                                <p
                                    className="mt-3 text-[14px] leading-relaxed"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {article.author.bio}
                                </p>
                            )}
                            <div className="mt-4 flex gap-2">
                                <Link
                                    href={`/@${article.author.username}`}
                                    className="sn-btn sn-btn-secondary sn-btn-sm"
                                >
                                    Voir le profil
                                </Link>
                                {article.author.github_handle && (
                                    <a
                                        href={`https://github.com/${article.author.github_handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sn-btn sn-btn-ghost sn-btn-sm"
                                    >
                                        <Github size={13} />{' '}
                                        {article.author.github_handle}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <Comments />

                    {/* Related */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-12">
                            <h3
                                className="mb-4 text-[20px] font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                Articles liés
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {relatedArticles.map((a) => (
                                    <ArticleCard key={a.slug} {...a} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* TOC sidebar */}
                <aside className="lg:col-span-4">
                    <div className="lg:sticky lg:top-24">
                        {toc.length > 0 && (
                            <>
                                <div
                                    className="mb-3 font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    // sommaire
                                </div>
                                <nav
                                    className="flex flex-col gap-1 border-l pl-4"
                                    style={{ borderColor: 'var(--sn-border)' }}
                                >
                                    {toc.map((t) => (
                                        <a
                                            key={t.id}
                                            href={`#${t.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document
                                                    .getElementById(t.id)
                                                    ?.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'start',
                                                    });
                                            }}
                                            className="py-1.5 text-[13.5px] transition-colors"
                                            style={{
                                                color:
                                                    activeSection === t.id
                                                        ? 'var(--sn-accent)'
                                                        : 'var(--sn-muted)',
                                                fontWeight:
                                                    activeSection === t.id
                                                        ? 500
                                                        : 400,
                                                borderLeft:
                                                    activeSection === t.id
                                                        ? '2px solid var(--sn-accent)'
                                                        : '2px solid transparent',
                                                marginLeft: -17,
                                                paddingLeft: 15,
                                            }}
                                        >
                                            {t.label}
                                        </a>
                                    ))}
                                </nav>
                            </>
                        )}

                        {/* Newsletter */}
                        <div className="sn-card mt-8 p-5">
                            <div
                                className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                // newsletter
                            </div>
                            <div
                                className="mt-2 text-[15px] font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                Les prochains articles dans ta boîte mail.
                            </div>
                            <p
                                className="mt-2 text-[12.5px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                1 email / mois, zéro spam.
                            </p>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="mt-3 flex gap-2"
                            >
                                <input
                                    className="flex-1 rounded-md border px-3 py-2 text-[13px] outline-none"
                                    placeholder="ton@email.com"
                                    style={{
                                        background: 'var(--sn-bg)',
                                        border: '1px solid var(--sn-border)',
                                        color: 'var(--sn-fg)',
                                    }}
                                />
                                <button className="sn-btn sn-btn-primary sn-btn-sm">
                                    OK
                                </button>
                            </form>
                        </div>
                    </div>
                </aside>
            </article>
        </>
    );
}
