import { ArrowRight } from 'lucide-react';
import ArticleCard from './article-card';

const FEATURED_ARTICLES = [
    {
        slug: 'n-plus-1',
        tag: 'Eloquent',
        title: 'Modèles sans N+1 : patterns éprouvés',
        excerpt:
            "Trois façons concrètes d'éviter les requêtes cachées, avec des exemples tirés d'apps en production.",
        author: 'Aïssatou Diop',
        date: '12 avr.',
        readMinutes: 6,
        tint: 'var(--sn-700)',
    },
    {
        slug: 'horizon',
        tag: 'Horizon',
        title: 'Queues & Horizon en production',
        excerpt:
            "Monitorer, scaler, relancer. Le guide pratique pour passer son application Laravel à l'asynchrone.",
        author: 'Omar Sy',
        date: '04 avr.',
        readMinutes: 9,
        tint: 'var(--sn-600)',
    },
    {
        slug: 'inertia-v3',
        tag: 'Inertia',
        title: 'Inertia v3 : les nouveautés',
        excerpt:
            "Polling, prefetch, deferred props — le panorama des nouvelles primitives qu'on utilise déjà au quotidien.",
        author: 'Mamadou F.',
        date: '28 mars',
        readMinutes: 5,
        tint: 'var(--sn-500)',
    },
];

export default function ArticlesSection() {
    return (
        <section className="mx-auto mt-24 max-w-350 px-6 lg:px-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div
                        className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        // à la une
                    </div>
                    <h2
                        className="mt-2 text-[30px] font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        Derniers articles
                    </h2>
                </div>
                <a href="/articles" className="sn-btn sn-btn-ghost sn-btn-sm">
                    Tout voir <ArrowRight size={13} />
                </a>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {FEATURED_ARTICLES.map((article) => (
                    <ArticleCard key={article.slug} {...article} />
                ))}
            </div>
        </section>
    );
}
