type Section = {
    h: string;
    body: string[];
    bullets?: string[];
};

type StaticPageProps = {
    title: string;
    updated: string;
    sections: Section[];
};

export default function StaticPage({
    title,
    updated,
    sections,
}: StaticPageProps) {
    return (
        <>
            <div className="mx-auto max-w-[760px] px-6 pt-10 pb-0 lg:px-10">
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
