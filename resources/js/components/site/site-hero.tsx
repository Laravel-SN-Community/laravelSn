import { ArrowRight } from 'lucide-react';

interface SiteHeroProps {
    onOpenCmd: () => void;
}

const tags = ['Eloquent', 'Inertia', 'Livewire', 'Queues', 'Tests', 'Deploy'];

export default function SiteHero({ onOpenCmd }: SiteHeroProps) {
    return (
        <section className="relative overflow-hidden">
            {/* Grid background */}
            <div
                className="bg-sn-grid absolute inset-0"
                aria-hidden
                style={{
                    WebkitMaskImage:
                        'linear-gradient(to bottom, black 0%, black 55%, transparent 95%)',
                    maskImage:
                        'linear-gradient(to bottom, black 0%, black 55%, transparent 95%)',
                }}
            />

            {/* Radial glow */}
            <div
                className="pointer-events-none absolute -top-40 -right-40 h-140 w-140 rounded-full opacity-30 blur-3xl"
                aria-hidden
                style={{
                    background:
                        'radial-gradient(closest-side, var(--sn-accent), transparent 70%)',
                }}
            />

            <div className="relative mx-auto grid max-w-350 items-center gap-10 px-6 pt-10 pb-14 lg:grid-cols-12 lg:px-10 lg:pt-16 lg:pb-20">
                {/* Text column */}
                <div className="sn-fade-up lg:col-span-6">
                    <h1
                        className="text-[30px] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[46px] lg:text-[68px]"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        La communauté
                        <br />
                        <span style={{ color: 'var(--sn-accent)' }}>
                            Laravel
                        </span>{' '}
                        du Sénégal.
                    </h1>

                    <p
                        className="mt-5 text-[15.5px] leading-[1.6] sm:text-[16.5px] lg:max-w-[52ch]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        Bienvenue sur le site de la communauté des développeurs
                        PHP et Laravel du Sénégal. On partage, on apprend, on
                        découvre, et on construit ensemble.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a href="/rejoindre" className="sn-btn sn-btn-primary">
                            Rejoindre la communauté <ArrowRight size={15} />
                        </a>
                        <a href="/articles" className="sn-btn sn-btn-secondary">
                            Lire les articles
                        </a>
                    </div>

                    {/* Inline stats */}
                    <div className="mt-10 grid max-w-[280px] grid-cols-3 gap-4 sm:max-w-md sm:gap-8">
                        {[
                            ['512', 'membres'],
                            ['08', 'événements'],
                            ['2021', 'depuis'],
                        ].map(([n, l]) => (
                            <div key={l}>
                                <div
                                    className="font-mono text-[22px] tracking-tight"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {n}
                                </div>
                                <div
                                    className="mt-0.5 text-[11.5px] tracking-wider uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {l}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Code block column — hidden on mobile, visible from lg (side-by-side) */}
                <div
                    className="sn-fade-up hidden lg:col-span-6 lg:block"
                    style={{ animationDelay: '.08s' }}
                >
                    <div
                        className="overflow-hidden rounded-xl"
                        style={{
                            background: 'var(--sn-code-bg)',
                            border: '1px solid var(--sn-code-border)',
                            boxShadow: 'var(--sn-shadow-lg)',
                        }}
                    >
                        {/* Titlebar */}
                        <div
                            className="flex h-10 items-center justify-between border-b px-4"
                            style={{
                                borderColor: 'var(--sn-code-inner-border)',
                            }}
                        >
                            <div className="flex items-center gap-1.5">
                                {['', '', ''].map((_, i) => (
                                    <span
                                        key={i}
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            background:
                                                'var(--sn-code-traffic)',
                                        }}
                                    />
                                ))}
                            </div>
                            <div
                                className="font-mono text-[11.5px]"
                                style={{ color: 'var(--sn-code-filename)' }}
                            >
                                app/Http/Controllers/JoinController.php
                            </div>
                            <div className="w-10" />
                        </div>

                        {/* Code */}
                        <pre
                            className="no-scrollbar overflow-auto p-5 font-mono text-[13px] leading-[1.75]"
                            style={{ color: 'var(--sn-code-text)' }}
                        >
                            <span style={{ color: 'var(--sn-code-comment)' }}>
                                {'// bienvenue — Dalal ak Diam'}
                            </span>
                            {'\n'}
                            <span style={{ color: 'var(--sn-code-keyword)' }}>
                                namespace
                            </span>
                            {' App\\Http\\Controllers;\n\n'}
                            <span style={{ color: 'var(--sn-code-keyword)' }}>
                                class
                            </span>{' '}
                            <span style={{ color: 'var(--sn-code-class)' }}>
                                JoinController
                            </span>{' '}
                            <span style={{ color: 'var(--sn-code-keyword)' }}>
                                extends
                            </span>{' '}
                            <span style={{ color: 'var(--sn-code-class)' }}>
                                Controller
                            </span>
                            {' {\n'}
                            {'  '}
                            <span style={{ color: 'var(--sn-code-keyword)' }}>
                                public function
                            </span>{' '}
                            <span style={{ color: 'var(--sn-code-fn)' }}>
                                __invoke
                            </span>
                            {'('}
                            <span style={{ color: 'var(--sn-code-class)' }}>
                                Request
                            </span>
                            {' $request)\n  {\n    '}
                            <span style={{ color: 'var(--sn-code-keyword)' }}>
                                return
                            </span>{' '}
                            <span style={{ color: 'var(--sn-code-class)' }}>
                                Community
                            </span>
                            {'::'}
                            <span style={{ color: 'var(--sn-code-fn)' }}>
                                welcome
                            </span>
                            {'($request->user())\n      ->'}
                            <span style={{ color: 'var(--sn-code-fn)' }}>
                                teranga
                            </span>
                            {'() '}
                            <span style={{ color: 'var(--sn-code-comment)' }}>
                                {'// hospitality, included.'}
                            </span>
                            {'\n      ->'}
                            <span style={{ color: 'var(--sn-code-fn)' }}>
                                channel
                            </span>
                            {'('}
                            <span style={{ color: 'var(--sn-code-string)' }}>
                                &apos;whatsapp&apos;
                            </span>
                            {')'}
                            <span
                                className="sn-caret"
                                style={{ color: 'var(--sn-code-caret)' }}
                            >
                                ▍
                            </span>
                            {'\n  }\n}'}
                        </pre>

                        {/* Status bar */}
                        <div
                            className="flex h-9 items-center justify-between border-t px-4 font-mono text-[11px]"
                            style={{
                                borderColor: 'var(--sn-code-inner-border)',
                                color: 'var(--sn-code-status-text)',
                            }}
                        >
                            <span>php artisan community:join</span>
                            <span>
                                <span
                                    style={{
                                        color: 'var(--sn-code-status-dot)',
                                    }}
                                >
                                    ●
                                </span>{' '}
                                online
                            </span>
                        </div>
                    </div>

                    {/* Tag cloud */}
                    <div
                        className="mt-4 flex flex-wrap gap-2 font-mono text-[11.5px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {tags.map((t) => (
                            <button
                                key={t}
                                onClick={onOpenCmd}
                                className="rounded-md px-2 py-1 transition-colors hover:text-(--sn-fg)"
                                style={{ border: '1px solid var(--sn-border)' }}
                            >
                                #{t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
