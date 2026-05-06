import { Link } from '@inertiajs/react';

type Section = {
    h: string;
    body: string[];
    bullets?: string[];
};

type StaticPageProps = {
    eyebrow: string;
    title: string;
    updated: string;
    breadcrumb: string;
    sections: Section[];
};

export default function StaticPage({
    eyebrow,
    title,
    updated,
    breadcrumb,
    sections,
}: StaticPageProps) {
    return (
        <>
            <div className="mx-auto max-w-[760px] px-6 pt-10 pb-0 lg:px-10">
                {/* Breadcrumb */}
                <div
                    className="mb-8 flex items-center gap-2 font-mono text-[11.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <Link href="/" className="hover:underline">
                        accueil
                    </Link>
                    <span>/</span>
                    <span>{breadcrumb}</span>
                </div>

                {/* Header */}
                <div
                    className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    {eyebrow}
                </div>
                <h1
                    className="mt-2 text-[36px] font-semibold tracking-[-0.02em]"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    {title}
                </h1>
                <p
                    className="mt-1 font-mono text-[12px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    Dernière mise à jour : {updated}
                </p>
            </div>

            {/* Content */}
            <section className="mx-auto max-w-[760px] px-6 pt-10 pb-24 lg:px-10">
                <div
                    className="border-t pt-10"
                    style={{ borderColor: 'var(--sn-border)' }}
                >
                    {sections.map((section, i) => (
                        <div key={i} className="mt-10 first:mt-0">
                            <h2
                                className="text-[22px] font-semibold tracking-[-0.015em]"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {section.h}
                            </h2>

                            {section.body.map((p, j) => (
                                <p
                                    key={j}
                                    className="mt-3 text-[15.5px] leading-[1.75]"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {p}
                                </p>
                            ))}

                            {section.bullets && (
                                <ul className="mt-3 space-y-2">
                                    {section.bullets.map((b, k) => (
                                        <li
                                            key={k}
                                            className="flex gap-3 text-[15px] leading-relaxed"
                                            style={{ color: 'var(--sn-fg)' }}
                                        >
                                            <span
                                                className="mt-1 shrink-0 font-mono"
                                                style={{
                                                    color: 'var(--sn-accent)',
                                                }}
                                            >
                                                ›
                                            </span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
