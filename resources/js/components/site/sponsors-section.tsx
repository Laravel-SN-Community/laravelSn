import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Sponsor {
    name: string;
    tier: 'platine' | 'or' | 'soutien';
    mark: React.ReactNode;
}

const sponsors: Sponsor[] = [
    {
        name: 'Sonatel',
        tier: 'platine',
        mark: (
            <>
                <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    sonatel
                </span>
                <span style={{ color: 'var(--sn-accent)' }}>•</span>
            </>
        ),
    },
    {
        name: 'Wave',
        tier: 'platine',
        mark: (
            <span style={{ fontWeight: 700, fontStyle: 'italic' }}>wave~</span>
        ),
    },
    {
        name: 'InTouch',
        tier: 'or',
        mark: (
            <span className="font-mono" style={{ letterSpacing: '0.02em' }}>
                inTouch
            </span>
        ),
    },
    {
        name: 'PayDunya',
        tier: 'or',
        mark: (
            <>
                <span style={{ fontWeight: 700 }}>pay</span>
                <span style={{ fontWeight: 300 }}>dunya</span>
            </>
        ),
    },
    {
        name: 'Orange Digital',
        tier: 'or',
        mark: (
            <span style={{ fontWeight: 800 }}>
                ODC<span style={{ color: 'var(--sn-accent)' }}>/</span>
            </span>
        ),
    },
    {
        name: 'Baamtu',
        tier: 'soutien',
        mark: <span className="font-mono">baamtu()</span>,
    },
    {
        name: 'Volkeno',
        tier: 'soutien',
        mark: <span style={{ fontWeight: 600 }}>volkeno</span>,
    },
    {
        name: 'SenHub',
        tier: 'soutien',
        mark: <span style={{ fontWeight: 700 }}>·senhub</span>,
    },
];

const tierLabels: Record<string, string> = {
    platine: 'Platine',
    or: 'Or',
    soutien: 'Soutien',
};

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
                <Link
                    href="/sponsors"
                    className="sn-btn sn-btn-ghost sn-btn-sm"
                >
                    Devenir partenaire <ArrowRight size={13} />
                </Link>
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
                                <div
                                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {tierLabels[s.tier]}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
