interface Sponsor {
    name: string;
    /** Single logo used in both themes. */
    src?: string;
    /** Theme-specific logos when a single asset doesn't read on both backgrounds. */
    srcLight?: string;
    srcDark?: string;
    /** Height utilities tuned per logo aspect ratio. */
    sizeClassName: string;
}

const sponsors: Sponsor[] = [
    {
        name: 'Laravel',
        src: '/images/sponsors/laravel.svg',
        sizeClassName: 'h-11 w-auto',
    },
    {
        name: 'Orange Digital Center',
        src: '/images/sponsors/orange-digital-center.png',
        sizeClassName: 'h-8 w-auto',
    },
    {
        name: 'Algolia Certificates',
        srcLight: '/images/sponsors/algolia-certificates-light.svg',
        srcDark: '/images/sponsors/algolia-certificates-dark.svg',
        sizeClassName: 'h-5 w-auto sm:h-6',
    },
    {
        name: 'Alal Technologie',
        src: '/images/sponsors/alal.png',
        sizeClassName: 'h-12 w-auto',
    },
];

function SponsorMark({ sponsor }: { sponsor: Sponsor }) {
    const className = `${sponsor.sizeClassName} object-contain`;

    if (sponsor.src) {
        return (
            <img
                src={sponsor.src}
                alt={sponsor.name}
                loading="lazy"
                className={className}
            />
        );
    }

    return (
        <>
            <img
                src={sponsor.srcLight}
                alt={sponsor.name}
                loading="lazy"
                className={`${className} block dark:hidden`}
            />
            <img
                src={sponsor.srcDark}
                alt={sponsor.name}
                loading="lazy"
                className={`${className} hidden dark:block`}
            />
        </>
    );
}

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
                                    'relative flex h-[120px] flex-col items-center justify-center gap-2 px-4 transition-colors hover:bg-[color:var(--sn-surface-2)]',
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
                                <SponsorMark sponsor={s} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
