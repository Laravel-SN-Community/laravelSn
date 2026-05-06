import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Link2 } from 'lucide-react';
import { useState } from 'react';
import { EVENTS, MEMBERS } from '@/data/community';

export default function Evenement() {
    const { slug } = usePage().props as unknown as { slug: string };
    const event = EVENTS.find((e) => e.slug === slug) ?? EVENTS[0];
    const speakers = event.speakers
        .map((s) => MEMBERS.find((m) => m.slug === s))
        .filter((m): m is (typeof MEMBERS)[0] => m !== undefined);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    return (
        <>
            <Head title={`${event.title} — Laravel Sénégal`} />

            <section className="mx-auto max-w-[1200px] px-6 pt-6 pb-12 lg:px-10">
                {/* Breadcrumb */}
                <div
                    className="mb-6 flex items-center gap-2 font-mono text-[11.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <Link href="/" className="hover:underline">
                        Accueil
                    </Link>
                    <span>/</span>
                    <Link href="/evenements" className="hover:underline">
                        Événements
                    </Link>
                    <span>/</span>
                    <span style={{ color: 'var(--sn-fg)' }}>{event.title}</span>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                    {/* Main */}
                    <div>
                        <div
                            className="flex items-center gap-2 font-mono text-[11.5px] tracking-[0.18em] uppercase"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            <span
                                className="rounded px-2 py-0.5"
                                style={{
                                    background: 'var(--sn-700)',
                                    color: '#fff',
                                }}
                            >
                                {event.type}
                            </span>
                            <span>·</span>
                            <span>{event.city}</span>
                        </div>

                        <h1 className="mt-4 text-[40px] leading-[1.02] font-semibold tracking-[-0.025em] lg:text-[52px]">
                            {event.title}
                        </h1>

                        <p
                            className="mt-4 max-w-[60ch] text-[16px] leading-relaxed lg:text-[17px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            {event.description}
                        </p>

                        {/* Meta strip */}
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div
                                className="rounded-lg p-4"
                                style={{
                                    background: 'var(--sn-surface)',
                                    border: '1px solid var(--sn-border)',
                                }}
                            >
                                <div
                                    className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    Date
                                </div>
                                <div className="mt-1.5 text-[17px] font-semibold">
                                    {event.day} {event.month} {event.year}
                                </div>
                                <div
                                    className="mt-0.5 font-mono text-[12px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {event.time}
                                </div>
                            </div>
                            <div
                                className="rounded-lg p-4"
                                style={{
                                    background: 'var(--sn-surface)',
                                    border: '1px solid var(--sn-border)',
                                }}
                            >
                                <div
                                    className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    Lieu
                                </div>
                                <div className="mt-1.5 text-[15px] leading-tight font-semibold">
                                    {event.where}
                                </div>
                                <div
                                    className="mt-0.5 font-mono text-[12px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {event.city}
                                </div>
                            </div>
                        </div>

                        {/* Agenda */}
                        <h2 className="mt-12 text-[24px] font-semibold tracking-[-0.015em]">
                            Programme
                        </h2>
                        <ol className="mt-5 space-y-1">
                            {event.agenda.map((a, i) => (
                                <li
                                    key={i}
                                    className="grid grid-cols-[80px_1fr] gap-4 py-3"
                                    style={{
                                        borderTop: '1px solid var(--sn-border)',
                                    }}
                                >
                                    <div
                                        className="font-mono text-[13px]"
                                        style={{ color: 'var(--sn-700)' }}
                                    >
                                        {a.t}
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-medium">
                                            {a.label}
                                        </div>
                                        {a.detail && (
                                            <div
                                                className="mt-0.5 font-mono text-[12px]"
                                                style={{
                                                    color: 'var(--sn-muted)',
                                                }}
                                            >
                                                {a.detail}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>

                        {/* Speakers */}
                        {speakers.length > 0 && (
                            <>
                                <h2 className="mt-12 text-[24px] font-semibold tracking-[-0.015em]">
                                    Intervenants
                                </h2>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {speakers.map((s) => (
                                        <div
                                            key={s.slug}
                                            className="flex items-center gap-3 rounded-lg p-3"
                                            style={{
                                                background: 'var(--sn-surface)',
                                                border: '1px solid var(--sn-border)',
                                            }}
                                        >
                                            <div
                                                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-mono text-[14px] font-semibold"
                                                style={{
                                                    background: s.tint,
                                                    color: '#fff',
                                                }}
                                            >
                                                {s.init}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate font-semibold">
                                                    {s.name}
                                                </div>
                                                <div
                                                    className="truncate font-mono text-[11.5px]"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                >
                                                    {s.role} · {s.company}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sticky sidebar */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div
                            className="rounded-xl p-6"
                            style={{
                                background: 'var(--sn-surface)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            <div
                                className="font-mono text-[11px] tracking-[0.2em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Inscription
                            </div>
                            <div className="mt-1 text-[22px] font-semibold tracking-[-0.015em]">
                                Réserver ma place
                            </div>
                            <div
                                className="mt-1 font-mono text-[12px]"
                                style={{ color: 'var(--sn-600)' }}
                            >
                                ● {event.price}
                            </div>

                            {submitted ? (
                                <div
                                    className="mt-5 rounded-lg p-4 text-center"
                                    style={{
                                        background: 'var(--sn-700)',
                                        color: '#fff',
                                    }}
                                >
                                    <Check size={20} className="mx-auto" />
                                    <div className="mt-2 font-semibold">
                                        Inscription confirmée 🎉
                                    </div>
                                    <div className="mt-1 font-mono text-[12px] opacity-90">
                                        Un email récap a été envoyé à {email}.
                                    </div>
                                </div>
                            ) : (
                                <form
                                    className="mt-5 space-y-3"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setSubmitted(true);
                                    }}
                                >
                                    <div>
                                        <label
                                            className="font-mono text-[11px] tracking-[0.15em] uppercase"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            Nom complet
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                            className="mt-1.5 w-full rounded-md px-3 py-2 text-[14px]"
                                            style={{
                                                background: 'var(--sn-bg)',
                                                border: '1px solid var(--sn-border)',
                                                color: 'var(--sn-fg)',
                                            }}
                                            placeholder="Aïssatou Diop"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="font-mono text-[11px] tracking-[0.15em] uppercase"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                            className="mt-1.5 w-full rounded-md px-3 py-2 text-[14px]"
                                            style={{
                                                background: 'var(--sn-bg)',
                                                border: '1px solid var(--sn-border)',
                                                color: 'var(--sn-fg)',
                                            }}
                                            placeholder="aissatou@wave.com"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="sn-btn sn-btn-primary w-full justify-center"
                                    >
                                        Confirmer l'inscription{' '}
                                        <ArrowRight size={14} />
                                    </button>
                                </form>
                            )}
                        </div>

                        <div
                            className="mt-4 rounded-xl p-4"
                            style={{
                                background: 'var(--sn-surface)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            <div
                                className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Partager
                            </div>
                            <div className="mt-2 flex gap-2">
                                <button className="sn-btn sn-btn-ghost sn-btn-sm flex-1 justify-center">
                                    <Link2 size={13} /> Lien
                                </button>
                                <button className="sn-btn sn-btn-ghost sn-btn-sm flex-1 justify-center">
                                    𝕏
                                </button>
                                <button className="sn-btn sn-btn-ghost sn-btn-sm flex-1 justify-center">
                                    in
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <div className="pb-10" />
        </>
    );
}
