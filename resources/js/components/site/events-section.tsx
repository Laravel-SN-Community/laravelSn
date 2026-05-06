import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

interface Event {
    day: string;
    month: string;
    year: string;
    title: string;
    where: string;
    time: string;
    seats: string;
    status: string;
    featured?: boolean;
}

const EVENTS: Event[] = [
    {
        day: '18',
        month: 'MAI',
        year: '2026',
        title: 'Meetup Dakar #09 — Filament & admin panels',
        where: 'CTIC Dakar · Plateau',
        time: '18:30',
        seats: '42 / 80',
        status: 'ouvert',
        featured: true,
    },
    {
        day: '06',
        month: 'JUIN',
        year: '2026',
        title: 'Workshop : tests Pest + CI GitHub Actions',
        where: 'Baobab Center · Mermoz',
        time: '10:00',
        seats: '24 / 30',
        status: 'ouvert',
    },
    {
        day: '20',
        month: 'JUIN',
        year: '2026',
        title: 'Laracon Sénégal 2026 — conférence annuelle',
        where: 'King Fahd Palace · Almadies',
        time: '09:00',
        seats: '210 / 300',
        status: 'early bird',
    },
];

function SeatsBar({ seats }: { seats: string }) {
    const [taken, total] = seats.split('/').map((x) => parseInt(x.trim()));
    const pct = Math.round((taken / total) * 100);

    return (
        <>
            <div
                className="h-1 overflow-hidden rounded-full"
                style={{ background: 'var(--sn-surface-2)' }}
            >
                <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: 'var(--sn-accent)' }}
                />
            </div>
            <div
                className="mt-1.5 font-mono text-[11.5px]"
                style={{ color: 'var(--sn-muted)' }}
            >
                <span style={{ color: 'var(--sn-fg)' }}>{taken}</span> / {total}
            </div>
        </>
    );
}

export default function EventsSection() {
    return (
        <section className="mx-auto mt-24 max-w-[1400px] px-6 lg:px-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div
                        className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        // agenda
                    </div>
                    <h2
                        className="mt-2 text-[30px] font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        Événements à venir
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="sn-btn sn-btn-ghost sn-btn-sm font-mono">
                        <Calendar size={13} />
                        .ics
                    </button>
                    <a
                        href="/evenements"
                        className="sn-btn sn-btn-secondary sn-btn-sm"
                    >
                        Tous les événements <ArrowRight size={13} />
                    </a>
                </div>
            </div>

            <div
                className="overflow-hidden rounded-[12px]"
                style={{
                    border: '1px solid var(--sn-border)',
                    background: 'var(--sn-surface)',
                }}
            >
                {EVENTS.map((e, i) => (
                    <a
                        key={i}
                        href={`/evenements/${e.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group grid grid-cols-12 items-center gap-4 p-5 transition-colors hover:bg-[color:var(--sn-surface-2)] md:gap-6 md:p-6"
                        style={{
                            borderBottom:
                                i < EVENTS.length - 1
                                    ? '1px solid var(--sn-border)'
                                    : 'none',
                        }}
                    >
                        {/* Date block */}
                        <div className="col-span-3 md:col-span-2">
                            <div
                                className="inline-flex min-w-[72px] flex-col items-center justify-center rounded-[8px] px-3 py-2.5"
                                style={{
                                    background: e.featured
                                        ? 'var(--sn-accent)'
                                        : 'var(--sn-surface-2)',
                                    color: e.featured
                                        ? 'var(--sn-accent-fg)'
                                        : 'var(--sn-fg)',
                                }}
                            >
                                <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-75">
                                    {e.month}
                                </div>
                                <div className="mt-0.5 font-mono text-[26px] leading-none tracking-tight">
                                    {e.day}
                                </div>
                                <div className="mt-0.5 font-mono text-[10px] opacity-60">
                                    {e.year}
                                </div>
                            </div>
                        </div>

                        {/* Title + location */}
                        <div className="col-span-9 min-w-0 md:col-span-6">
                            <div className="flex flex-wrap items-center gap-2">
                                {e.featured && (
                                    <span className="sn-badge sn-badge-primary text-[10px] tracking-[0.12em] uppercase">
                                        à la une
                                    </span>
                                )}
                                <span className="sn-badge sn-badge-neutral text-[10px] tracking-[0.12em] uppercase">
                                    {e.status}
                                </span>
                            </div>
                            <div
                                className="mt-2 text-[17px] leading-snug font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {e.title}
                            </div>
                            <div
                                className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={12} />
                                    {e.where}
                                </span>
                                <span className="flex items-center gap-1.5 font-mono">
                                    <Clock size={12} />
                                    {e.time}
                                </span>
                            </div>
                        </div>

                        {/* Seats */}
                        <div className="col-span-8 md:col-span-3">
                            <div
                                className="mb-1.5 font-mono text-[11px] tracking-[0.15em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                places
                            </div>
                            <SeatsBar seats={e.seats} />
                        </div>

                        {/* Arrow */}
                        <div className="col-span-4 flex justify-end md:col-span-1">
                            <div
                                className="grid h-9 w-9 place-items-center rounded-full transition-all group-hover:bg-[color:var(--sn-accent)] group-hover:text-[color:var(--sn-accent-fg)]"
                                style={{
                                    background: 'var(--sn-surface-2)',
                                    color: 'var(--sn-fg)',
                                }}
                                aria-hidden
                            >
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
