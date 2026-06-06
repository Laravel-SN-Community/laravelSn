import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

interface Venue {
    id: number;
    name: string;
    district: string;
}

interface Event {
    id: number;
    slug: string;
    title: string;
    starts_at: string;
    capacity: number | null;
    confirmed_registrations_count: number;
    is_featured: boolean;
    registrations_open: boolean;
    venue: Venue | null;
}

interface Props {
    events: Event[];
}

function SeatsBar({ taken, total }: { taken: number; total: number | null }) {
    if (total === null) {
        return null;
    }

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

export default function EventsSection({ events }: Props) {
    return (
        <section className="mx-auto mt-24 max-w-[1400px] px-6 lg:px-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2
                        className="text-[30px] font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        Événements à venir
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/events"
                        className="sn-btn sn-btn-secondary sn-btn-sm"
                    >
                        Tous les événements <ArrowRight size={13} />
                    </Link>
                </div>
            </div>

            {events.length === 0 ? (
                <div
                    className="rounded-[12px] px-6 py-12 text-center text-[14px]"
                    style={{
                        border: '1px solid var(--sn-border)',
                        background: 'var(--sn-surface)',
                        color: 'var(--sn-muted)',
                    }}
                >
                    Aucun événement à venir pour le moment.
                </div>
            ) : (
                <div
                    className="overflow-hidden rounded-[12px]"
                    style={{
                        border: '1px solid var(--sn-border)',
                        background: 'var(--sn-surface)',
                    }}
                >
                    {events.map((e, i) => {
                        const date = new Date(e.starts_at);
                        const day = date.toLocaleDateString('fr-FR', {
                            day: '2-digit',
                        });
                        const month = date
                            .toLocaleDateString('fr-FR', { month: 'short' })
                            .toUpperCase();
                        const year = date.getFullYear().toString();
                        const time = date.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        });
                        const where = e.venue
                            ? `${e.venue.name} · ${e.venue.district}`
                            : 'En ligne';

                        return (
                            <Link
                                key={e.id}
                                href={`/events/${e.slug}`}
                                className="group grid grid-cols-12 items-center gap-4 p-5 transition-colors hover:bg-[color:var(--sn-surface-2)] md:gap-6 md:p-6"
                                style={{
                                    borderBottom:
                                        i < events.length - 1
                                            ? '1px solid var(--sn-border)'
                                            : 'none',
                                }}
                            >
                                {/* Date block */}
                                <div className="col-span-3 md:col-span-2">
                                    <div
                                        className="inline-flex min-w-[72px] flex-col items-center justify-center rounded-[8px] px-3 py-2.5"
                                        style={{
                                            background: e.is_featured
                                                ? 'var(--sn-accent)'
                                                : 'var(--sn-surface-2)',
                                            color: e.is_featured
                                                ? 'var(--sn-accent-fg)'
                                                : 'var(--sn-fg)',
                                        }}
                                    >
                                        <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-75">
                                            {month}
                                        </div>
                                        <div className="mt-0.5 font-mono text-[26px] leading-none tracking-tight">
                                            {day}
                                        </div>
                                        <div className="mt-0.5 font-mono text-[10px] opacity-60">
                                            {year}
                                        </div>
                                    </div>
                                </div>

                                {/* Title + location */}
                                <div className="col-span-9 min-w-0 md:col-span-6">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {e.is_featured && (
                                            <span className="sn-badge sn-badge-primary text-[10px] tracking-[0.12em] uppercase">
                                                à la une
                                            </span>
                                        )}
                                        <span className="sn-badge sn-badge-neutral text-[10px] tracking-[0.12em] uppercase">
                                            {e.registrations_open
                                                ? 'ouvert'
                                                : 'fermé'}
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
                                            {where}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-mono">
                                            <Clock size={12} />
                                            {time}
                                        </span>
                                    </div>
                                </div>

                                {/* Seats */}
                                {e.capacity !== null && (
                                    <div className="col-span-8 md:col-span-3">
                                        <div
                                            className="mb-1.5 font-mono text-[11px] tracking-[0.15em] uppercase"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            places
                                        </div>
                                        <SeatsBar
                                            taken={
                                                e.confirmed_registrations_count
                                            }
                                            total={e.capacity}
                                        />
                                    </div>
                                )}

                                {/* Arrow */}
                                <div
                                    className={`flex justify-end ${e.capacity !== null ? 'col-span-4 md:col-span-1' : 'col-span-9 col-start-4 md:col-span-4 md:col-start-auto'}`}
                                >
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
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
