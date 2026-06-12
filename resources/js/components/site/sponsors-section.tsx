interface Sponsor {
    name: string;
    mark: React.ReactNode;
}

const sponsors: Sponsor[] = [
    {
        name: 'Laravel',
        mark: (
            <>
                <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Laravel
                </span>
                <span style={{ color: 'var(--sn-accent)' }}></span>
            </>
        ),
    },
    {
        name: 'Orange Digital',
        mark: (
            <span style={{ fontWeight: 800 }}>
             Orange Digital Center<span style={{ color: 'var(--sn-accent)' }}></span>
            </span>
        ),
    },
    {
        name: 'Certification for Laravel',
        mark: (
            <span style={{ fontWeight: 800 }}>Certification for Laravel</span>
        ),
    },
    {
        name: 'ALal Technologie',
        mark: (
            <span style={{ fontWeight: 800 }}>
                Alal Technologie
            </span>
        ),
    },
];

export default function SponsorsSection() {
    return (
        <section className="mx-auto mt-20 max-w-[1400px] px-6 lg:px-10">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2
                        className="mt-2 text-[30px] font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        Partenaires &amp; sponsors
                    </h2>
                </div>
                {/*<Link
                    href="/sponsors"
                    className="sn-btn sn-btn-ghost sn-btn-sm"
                >
                    Devenir partenaire <ArrowRight size={13} />
                </Link>*/}
            </div>

            <div className="sn-card overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {sponsors.map((s, i) => {
                        const n = sponsors.length;
                        const hasRightMobile = i % 2 !== 1;
                        const hasRightDesktop = i % 4 !== 3;
                        const hasBottomMobile = i < n - 2;
                        const hasBottomDesktop = i < n - 4;

                        return (
                            <div
                                key={s.name}
                                className={[
                                    'relative flex h-[120px] flex-col items-center justify-center gap-2 transition-colors hover:bg-[color:var(--sn-surface-2)]',
                                    hasRightMobile ? 'border-r' : '',
                                    hasRightDesktop
                                        ? 'md:border-r'
                                        : 'md:border-r-0',
                                    hasBottomMobile ? 'border-b' : '',
                                    hasBottomDesktop
                                        ? 'md:border-b'
                                        : 'md:border-b-0',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                style={{ borderColor: 'var(--sn-border)' }}
                            >
                                <div
                                    className="text-[22px]"
                                    style={{
                                        color: 'var(--sn-fg)',
                                        opacity: 0.85,
                                    }}
                                >
                                    {s.mark}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
