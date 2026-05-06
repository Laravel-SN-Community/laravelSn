import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EVENTS } from '@/data/community';

export default function Evenements() {
    const [city, setCity] = useState('toutes');
    const [type, setType] = useState('tous');

    const cities = useMemo(
        () => ['toutes', ...Array.from(new Set(EVENTS.map((e) => e.city)))],
        [],
    );
    const types = useMemo(
        () => ['tous', ...Array.from(new Set(EVENTS.map((e) => e.type)))],
        [],
    );

    const filtered = useMemo(
        () =>
            EVENTS.filter(
                (e) =>
                    (city === 'toutes' || e.city === city) &&
                    (type === 'tous' || e.type === type),
            ),
        [city, type],
    );

    const featured = filtered.find((e) => e.featured) ?? filtered[0];
    const rest = featured ? filtered.filter((e) => e !== featured) : [];

    return (
        <>
            <Head title="Événements — Laravel Sénégal" />

            {/* Page header */}
            <section className="mx-auto max-w-[1200px] px-6 pt-10 pb-6 lg:px-10 lg:pt-16">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div
                            className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            // communauté · IRL
                        </div>
                        <h1
                            className="mt-2 text-[40px] leading-[1.02] font-semibold tracking-[-0.025em] lg:text-[56px]"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            Événements
                        </h1>
                        <p
                            className="mt-4 text-[16px] leading-relaxed lg:text-[17px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Meetups, workshops, conférences. Dakar, Saint-Louis,
                            Thiès. Café, code, kebab.
                        </p>
                    </div>
                    <button className="sn-btn sn-btn-secondary">
                        <Calendar size={14} /> Ajouter au calendrier
                    </button>
                </div>
            </section>

            {/* Filters */}
            <section className="mx-auto max-w-[1200px] px-6 pb-8 lg:px-10">
                <div className="flex flex-wrap items-center gap-4 font-mono text-[12px]">
                    <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--sn-muted)' }}>
                            ville :
                        </span>
                        <div className="flex gap-1">
                            {cities.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCity(c)}
                                    className="rounded-md px-2.5 py-1 transition-colors"
                                    style={{
                                        background:
                                            city === c
                                                ? 'var(--sn-fg)'
                                                : 'transparent',
                                        color:
                                            city === c
                                                ? 'var(--sn-bg)'
                                                : 'var(--sn-muted)',
                                        border: '1px solid var(--sn-border)',
                                    }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--sn-muted)' }}>type :</span>
                        <div className="flex gap-1">
                            {types.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className="rounded-md px-2.5 py-1 transition-colors"
                                    style={{
                                        background:
                                            type === t
                                                ? 'var(--sn-fg)'
                                                : 'transparent',
                                        color:
                                            type === t
                                                ? 'var(--sn-bg)'
                                                : 'var(--sn-muted)',
                                        border: '1px solid var(--sn-border)',
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div
                        className="ml-auto"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {filtered.length} évènement
                        {filtered.length > 1 ? 's' : ''}
                    </div>
                </div>
            </section>

            {/* Featured event */}
            {featured && (
                <section className="mx-auto max-w-[1200px] px-6 pb-10 lg:px-10">
                    <Link
                        href={`/evenements/${featured.slug}`}
                        className="group block"
                    >
                        <div
                            className="grid overflow-hidden rounded-2xl lg:grid-cols-[300px_1fr]"
                            style={{
                                background: 'var(--sn-surface)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            {/* Date block */}
                            <div
                                className="flex flex-col items-center justify-center p-8 text-center lg:p-10"
                                style={{
                                    background: 'var(--sn-700)',
                                    color: '#fff',
                                }}
                            >
                                <div className="font-mono text-[12px] tracking-[0.2em] uppercase opacity-80">
                                    {featured.month}
                                </div>
                                <div className="my-1 text-[88px] leading-[0.9] font-semibold tracking-[-0.04em]">
                                    {featured.day}
                                </div>
                                <div className="font-mono text-[12px] opacity-80">
                                    {featured.year}
                                </div>
                                <div
                                    className="mt-4 rounded-full px-3 py-1 font-mono text-[10.5px] tracking-[0.15em] uppercase"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                    }}
                                >
                                    {featured.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-8 lg:p-10">
                                <div
                                    className="flex items-center gap-2 font-mono text-[11.5px] tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    <span>★ à la une</span>
                                    <span>·</span>
                                    <span>{featured.type}</span>
                                    <span>·</span>
                                    <span>{featured.price}</span>
                                </div>
                                <h2 className="mt-3 text-[28px] leading-[1.05] font-semibold tracking-[-0.02em] group-hover:underline lg:text-[34px]">
                                    {featured.title}
                                </h2>
                                <p
                                    className="mt-3 max-w-[60ch] text-[15px] leading-relaxed"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {featured.description}
                                </p>
                                <div
                                    className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    <span>📍 {featured.where}</span>
                                    <span>🕒 {featured.time}</span>
                                    <span>
                                        👥 {featured.seats} places restantes /{' '}
                                        {featured.total}
                                    </span>
                                </div>
                                <div className="mt-6 flex items-center gap-3">
                                    <span className="sn-btn sn-btn-primary">
                                        S'inscrire <ArrowRight size={14} />
                                    </span>
                                    <span
                                        className="font-mono text-[12px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        → détails complets
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* Rest of events */}
            {rest.length > 0 && (
                <section className="mx-auto max-w-[1200px] px-6 pb-20 lg:px-10">
                    <h3
                        className="mb-4 font-mono text-[11.5px] tracking-[0.2em] uppercase"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        ── prochains rendez-vous
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {rest.map((e) => (
                            <Link
                                key={e.slug}
                                href={`/evenements/${e.slug}`}
                                className="block rounded-xl p-5 transition-all hover:-translate-y-0.5"
                                style={{
                                    background: 'var(--sn-surface)',
                                    border: '1px solid var(--sn-border)',
                                }}
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-[64px] flex-shrink-0 text-center">
                                        <div
                                            className="font-mono text-[10px] tracking-[0.18em] uppercase"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            {e.month}
                                        </div>
                                        <div
                                            className="mt-0.5 text-[36px] leading-none font-semibold tracking-[-0.03em]"
                                            style={{ color: 'var(--sn-700)' }}
                                        >
                                            {e.day}
                                        </div>
                                        <div
                                            className="mt-0.5 font-mono text-[10px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            {e.time}
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.15em] uppercase"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            <span
                                                className="rounded px-1.5 py-0.5"
                                                style={{
                                                    background:
                                                        'var(--sn-surface-2)',
                                                    color: 'var(--sn-fg)',
                                                }}
                                            >
                                                {e.type}
                                            </span>
                                            <span>·</span>
                                            <span>{e.city}</span>
                                        </div>
                                        <h4 className="mt-2 text-[17px] leading-[1.25] font-semibold tracking-[-0.01em]">
                                            {e.title}
                                        </h4>
                                        <div
                                            className="mt-2 font-mono text-[11.5px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            📍 {e.where}
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 font-mono text-[11px]">
                                            <div
                                                className="h-1 flex-1 overflow-hidden rounded-full"
                                                style={{
                                                    background:
                                                        'var(--sn-surface-2)',
                                                }}
                                            >
                                                <div
                                                    className="h-full"
                                                    style={{
                                                        width: `${((e.total - e.seats) / e.total) * 100}%`,
                                                        background:
                                                            'var(--sn-600)',
                                                    }}
                                                />
                                            </div>
                                            <span
                                                style={{
                                                    color: 'var(--sn-muted)',
                                                }}
                                            >
                                                {e.seats} restant
                                                {e.seats > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {filtered.length === 0 && (
                <section className="mx-auto max-w-[1200px] px-6 pb-20 lg:px-10">
                    <div
                        className="rounded-xl p-12 text-center"
                        style={{
                            background: 'var(--sn-surface)',
                            border: '1px solid var(--sn-border)',
                        }}
                    >
                        <div
                            className="mb-2 font-mono text-[12px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            // aucun résultat
                        </div>
                        <p
                            className="text-[15px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Essaie de changer les filtres.
                        </p>
                    </div>
                </section>
            )}

            <div className="pb-10" />
        </>
    );
}
