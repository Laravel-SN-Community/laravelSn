import { Head, Link, usePage } from '@inertiajs/react';
import { Github, Link2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ArticleCard from '@/components/site/article-card';
import { ARTICLES, MEMBERS } from '@/data/community';

const TOC = [
    { id: 'intro', label: 'Introduction' },
    { id: 'probleme', label: 'Le problème' },
    { id: 'solution', label: 'Notre approche' },
    { id: 'exemples', label: 'Exemples de code' },
    { id: 'pieges', label: 'Pièges à éviter' },
    { id: 'conclusion', label: 'Pour aller plus loin' },
];

function Comments() {
    const [list, setList] = useState([
        {
            id: 1,
            author: 'Khady Ndiaye',
            init: 'KN',
            tint: '#3ea777',
            when: 'il y a 2h',
            body: 'Excellent article 👏 On a exactement le même pattern chez Baamtu. Le <code>preventLazyLoading()</code> a changé nos vies.',
        },
        {
            id: 2,
            author: 'Ibrahima Ba',
            init: 'IB',
            tint: '#0f7b4d',
            when: 'il y a 5h',
            body: 'Petite suggestion : parler aussi de <code>Model::preventSilentlyDiscardingAttributes()</code> qui va dans le même sens.',
        },
        {
            id: 3,
            author: 'Pape Diop',
            init: 'PD',
            tint: '#0b6640',
            when: 'hier',
            body: 'Merci, je vais tester <code>loadMissing()</code> dès demain sur notre projet InTouch.',
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
                            dangerouslySetInnerHTML={{ __html: c.body }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Article() {
    const { slug } = usePage().props as unknown as { slug: string };
    const article = ARTICLES.find((a) => a.slug === slug) ?? ARTICLES[0];
    const author =
        MEMBERS.find((m) => m.slug === article.authorSlug) ?? MEMBERS[0];

    const [saved, setSaved] = useState(false);
    const [reactions, setReactions] = useState({
        up: 128,
        heart: 42,
        fire: 18,
    });
    const [activeSection, setActiveSection] = useState('intro');

    useEffect(() => {
        const ids = TOC.map((t) => t.id);
        const handler = () => {
            let current = 'intro';

            for (const id of ids) {
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
    }, [slug]);

    const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

    return (
        <>
            <Head title={`${article.title} — Laravel Sénégal`} />

            {/* Breadcrumb */}
            <div
                className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 pt-6 font-mono text-[11.5px] lg:px-10"
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
                    <div className="mb-4 flex gap-2">
                        <span className="sn-badge sn-badge-primary">
                            #{article.tag}
                        </span>
                        <span className="sn-badge sn-badge-neutral">FR</span>
                        <span className="sn-badge sn-badge-neutral">
                            {article.readMinutes} min de lecture
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
                            href={`/membres/${author.slug}`}
                            className="flex items-center gap-3"
                        >
                            <span
                                className="grid h-11 w-11 place-items-center rounded-full font-mono text-[13px]"
                                style={{
                                    background: author.tint,
                                    color: '#fff',
                                }}
                            >
                                {author.init}
                            </span>
                            <div>
                                <div
                                    className="text-[14px] font-medium"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {author.name}
                                </div>
                                <div
                                    className="text-[12.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {author.role} · {author.company}
                                </div>
                            </div>
                        </Link>
                        <div
                            className="ml-auto text-right font-mono text-[11.5px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            <div>{article.date}</div>
                            <div className="opacity-70">màj il y a 3 j</div>
                        </div>
                    </div>

                    {/* Hero */}
                    <div
                        className="relative mt-8 overflow-hidden rounded-xl"
                        style={{
                            aspectRatio: '16/8',
                            background: `linear-gradient(135deg, ${article.tint}, var(--sn-500))`,
                        }}
                    >
                        <div className="bg-sn-grid absolute inset-0 opacity-30" />
                        <div
                            className="absolute bottom-6 left-6 font-mono text-[13px]"
                            style={{ color: 'rgba(255,255,255,.85)' }}
                        >
                            #{article.tag} · {article.dateISO}
                        </div>
                    </div>

                    {/* Article body */}
                    <div className="article-body mt-10">
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
                            .article-body .callout { margin:28px 0; padding:16px 18px; background:color-mix(in oklch, var(--sn-accent) 8%, transparent); border:1px solid color-mix(in oklch, var(--sn-accent) 30%, transparent); border-radius:10px; font-size:15px; line-height:1.65; color:var(--sn-fg); }
                        `}</style>

                        <h2 id="intro">Introduction</h2>
                        <p>
                            Le problème des requêtes N+1 est aussi vieux que les
                            ORM. Avec Eloquent, il est particulièrement facile
                            d'en créer sans s'en rendre compte — un{' '}
                            <code>foreach</code> un peu trop optimiste, une
                            relation chargée paresseusement, et voilà. Mille
                            requêtes SQL plus tard, votre page met cinq secondes
                            à se charger.
                        </p>
                        <p>
                            Dans cet article, je partage les trois patterns
                            qu'on utilise systématiquement chez{' '}
                            <strong>Wave</strong> pour éviter ces pièges, avec
                            des exemples réels tirés d'apps en production.
                        </p>
                        <div className="callout">
                            <strong>TL;DR :</strong> utilisez{' '}
                            <code>with()</code> de manière chirurgicale,{' '}
                            <code>loadMissing()</code> pour les relations
                            conditionnelles, et activez{' '}
                            <code>preventLazyLoading()</code> en dev pour tout
                            attraper.
                        </div>

                        <h2 id="probleme">Le problème</h2>
                        <p>
                            Prenons un exemple : afficher une liste de 50
                            commandes avec leur utilisateur et leurs items. Du
                            code innocent ressemble à ça :
                        </p>
                        <pre>
                            <span style={{ color: '#c792ea' }}>foreach</span>{' '}
                            {'($orders as $order) {\n'}
                            {'  '}
                            <span style={{ color: '#82aaff' }}>echo</span>{' '}
                            {'$order->user->name;  '}
                            <span
                                style={{ color: '#5a7a6a' }}
                            >{`// 1 requête par order`}</span>
                            {'\n  '}
                            <span style={{ color: '#c792ea' }}>
                                foreach
                            </span>{' '}
                            {'($order->items as $item) {\n    '}
                            <span style={{ color: '#82aaff' }}>echo</span>{' '}
                            {'$item->name;\n  }\n}'}
                        </pre>
                        <p>
                            Total : <strong>1 + 50 + 50 = 101 requêtes</strong>.
                            Ça passe en dev, ça casse en prod.
                        </p>

                        <h2 id="solution">Notre approche</h2>
                        <p>Trois outils, trois usages distincts :</p>
                        <ul>
                            <li>
                                <code>with()</code> au moment de la requête
                                initiale, quand on sait ce qu'on va afficher.
                            </li>
                            <li>
                                <code>loadMissing()</code> dans les services,
                                pour ne charger que ce qui manque.
                            </li>
                            <li>
                                <code>preventLazyLoading()</code> dans le{' '}
                                <code>AppServiceProvider</code>, qui lève une
                                exception en dev si on oublie.
                            </li>
                        </ul>
                        <blockquote>
                            La meilleure protection contre les N+1, c'est un
                            linter qui refuse la compilation quand on fait une
                            connerie. — notre règle en interne.
                        </blockquote>

                        <h2 id="exemples">Exemples de code</h2>
                        <p>Voici comment on réécrit l'exemple précédent :</p>
                        <pre>
                            <span style={{ color: '#c792ea' }}>use</span>
                            {' App\\Models\\Order;\n\n'}
                            {'$orders = Order::'}
                            <span style={{ color: '#82aaff' }}>with</span>
                            {"(['user', 'items.product'])\n  ->"}
                            <span style={{ color: '#82aaff' }}>whereDate</span>
                            {"('created_at', "}
                            <span style={{ color: '#82aaff' }}>today</span>
                            {'())\n  ->'}
                            <span style={{ color: '#82aaff' }}>get</span>
                            {'();'}
                        </pre>
                        <p>
                            Trois requêtes au total, quelle que soit la taille
                            de <code>$orders</code>.
                        </p>

                        <h2 id="pieges">Pièges à éviter</h2>
                        <ul>
                            <li>
                                Ne pas abuser de <code>withCount()</code> — si
                                vous l'appelez dans une boucle, vous êtes de
                                retour au point de départ.
                            </li>
                            <li>
                                Attention aux <strong>accesseurs</strong> qui
                                font des requêtes — un{' '}
                                <code>getFullNameAttribute</code> qui hit la DB,
                                c'est vicieux.
                            </li>
                            <li>
                                Le scope <code>published</code> sur une relation
                                peut court-circuiter l'eager loading si on ne
                                fait pas gaffe.
                            </li>
                        </ul>

                        <h2 id="conclusion">Pour aller plus loin</h2>
                        <ul>
                            <li>
                                La doc officielle Eloquent — section{' '}
                                <em>Eager Loading</em>
                            </li>
                            <li>
                                Le package{' '}
                                <code>beyondcode/laravel-query-detector</code>
                            </li>
                            <li>
                                Channel <code>#eloquent-help</code> sur notre
                                Discord
                            </li>
                        </ul>
                    </div>

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
                            href={`/membres/${author.slug}`}
                            className="shrink-0"
                        >
                            <span
                                className="grid h-16 w-16 place-items-center rounded-full font-mono text-[18px]"
                                style={{
                                    background: author.tint,
                                    color: '#fff',
                                }}
                            >
                                {author.init}
                            </span>
                        </Link>
                        <div className="min-w-0 flex-1">
                            <div
                                className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                écrit par
                            </div>
                            <Link
                                href={`/membres/${author.slug}`}
                                className="mt-0.5 block text-[18px] font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {author.name}
                            </Link>
                            <div
                                className="mt-0.5 text-[13.5px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                {author.role} · {author.company} · {author.city}
                            </div>
                            <p
                                className="mt-3 text-[14px] leading-relaxed"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                {author.bio}
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Link
                                    href={`/membres/${author.slug}`}
                                    className="sn-btn sn-btn-secondary sn-btn-sm"
                                >
                                    Voir le profil
                                </Link>
                                {author.github && (
                                    <a
                                        href={`https://github.com/${author.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sn-btn sn-btn-ghost sn-btn-sm"
                                    >
                                        <Github size={13} /> {author.github}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <Comments />

                    {/* Related */}
                    <div className="mt-12">
                        <h3
                            className="mb-4 text-[20px] font-semibold tracking-tight"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            Articles liés
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {related.map((a) => (
                                <ArticleCard
                                    key={a.slug}
                                    slug={a.slug}
                                    tag={a.tag}
                                    title={a.title}
                                    excerpt={a.excerpt}
                                    author={a.author}
                                    date={a.date}
                                    readMinutes={a.readMinutes}
                                    tint={a.tint}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* TOC sidebar */}
                <aside className="lg:col-span-4">
                    <div className="lg:sticky lg:top-24">
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
                            {TOC.map((t) => (
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
                                            activeSection === t.id ? 500 : 400,
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
