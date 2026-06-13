interface Sponsor {
    name: string;
    /** External sponsor website, opened in a new tab. */
    href: string;
    /** Single logo used in both themes. */
    src?: string;
    /** Theme-specific logos when a single asset doesn't read on both backgrounds. */
    srcLight?: string;
    srcDark?: string;
    /**
     * Sizing utilities tuned per logo aspect ratio (mobile-first).
     * Compact/square marks are height-bound; wide wordmarks are width-bound
     * so they scale up with the cell instead of staying small.
     */
    imgClassName: string;
}

const sponsors: Sponsor[] = [
    {
        name: 'Laravel',
        href: 'https://laravel.com',
        src: '/images/sponsors/laravel.svg',
        imgClassName: 'h-11 w-auto max-w-full md:h-16 lg:h-20',
    },
    {
        name: 'Orange Digital Center',
        href: 'https://orangedigitalcenter.sn',
        srcLight: '/images/sponsors/orange-digital-center-light.png',
        srcDark: '/images/sponsors/orange-digital-center-dark.png',
        imgClassName:
            'w-[82%] max-w-[280px] max-h-8 md:max-h-14 lg:max-h-[68px]',
    },
    {
        name: 'Algolia Certificates',
        href: 'https://certificates.dev/',
        srcLight: '/images/sponsors/algolia-certificates-light.svg',
        srcDark: '/images/sponsors/algolia-certificates-dark.svg',
        imgClassName: 'w-[82%] max-w-[220px] max-h-6 md:max-h-10 lg:max-h-12',
    },
    {
        name: 'Alal Technologie',
        href: 'https://saalal.com/',
        src: '/images/sponsors/alal.png',
        imgClassName: 'h-11 w-auto max-w-full md:h-16 lg:h-20',
    },
];

function SponsorMark({ sponsor }: { sponsor: Sponsor }) {
    const className = `${sponsor.imgClassName} object-contain`;

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
        <section className="mx-auto mt-16 max-w-[1400px] px-6 sm:mt-20 lg:px-10">
            <div className="mb-6 flex items-end justify-between">
                <h2
                    className="text-2xl font-semibold tracking-tight sm:text-[30px]"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    Partenaires &amp; sponsors
                </h2>
                {/*<Link
                    href="/sponsors"
                    className="sn-btn sn-btn-ghost sn-btn-sm"
                >
                    Devenir partenaire <ArrowRight size={13} />
                </Link>*/}
            </div>

            <div className="sn-card overflow-hidden">
                {/* 1px gaps reveal the grid background as clean dividers,
                    independent of column count or row spans. */}
                <div
                    className="grid grid-cols-2 gap-px md:grid-cols-4"
                    style={{ backgroundColor: 'var(--sn-border)' }}
                >
                    {sponsors.map((s) => (
                        <a
                            key={s.name}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.name}
                            className="group relative flex h-24 items-center justify-center px-4 md:h-36 lg:h-40 lg:px-6"
                            style={{ backgroundColor: 'var(--sn-surface)' }}
                        >
                            {/* Hover highlight fades via opacity so the cell
                                background snaps cleanly on theme change. */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                style={{
                                    backgroundColor: 'var(--sn-surface-2)',
                                }}
                            />
                            <span className="relative">
                                <SponsorMark sponsor={s} />
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
