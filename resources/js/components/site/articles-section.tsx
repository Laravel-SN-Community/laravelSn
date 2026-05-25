import { ArrowRight } from 'lucide-react';
import type { ArticleSummary } from '@/types/article';
import ArticleCard from './article-card';

type Props = { articles: ArticleSummary[] };

export default function ArticlesSection({ articles }: Props) {
    return (
        <section className="mx-auto mt-24 max-w-350 px-6 lg:px-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
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

            {articles.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-3">
                    {articles.map((article) => (
                        <ArticleCard key={article.slug} {...article} />
                    ))}
                </div>
            ) : (
                <div
                    className="rounded-xl p-10 text-center font-mono text-[13px]"
                    style={{
                        border: '1px solid var(--sn-border)',
                        color: 'var(--sn-muted)',
                    }}
                >
                    Aucun article publié pour l'instant.
                </div>
            )}
        </section>
    );
}
