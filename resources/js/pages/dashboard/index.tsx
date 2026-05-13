import { Head, Link, usePage } from '@inertiajs/react';
import DashSidebar from '@/components/site/dashboard-sidebar';
import { ARTICLES, EVENTS, MEMBERS } from '@/data/community';

interface AuthUser {
    name: string;
    email: string;
}

function StatCard({
    label,
    value,
    delta,
}: {
    label: string;
    value: string;
    delta: string;
}) {
    return (
        <div
            className="rounded-xl p-4"
            style={{
                background: 'var(--sn-surface)',
                border: '1px solid var(--sn-border)',
            }}
        >
            <div
                className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--sn-muted)' }}
            >
                {label}
            </div>
            <div
                className="mt-1.5 text-[28px] font-semibold tracking-[-0.02em]"
                style={{ color: 'var(--sn-fg)' }}
            >
                {value}
            </div>
            <div
                className="mt-1 font-mono text-[11px]"
                style={{ color: 'var(--sn-600)' }}
            >
                ↗ {delta}
            </div>
        </div>
    );
}

function DashCard({
    eyebrow,
    title,
    actions,
    children,
}: {
    eyebrow?: string;
    title?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            className="rounded-xl p-6"
            style={{
                background: 'var(--sn-surface)',
                border: '1px solid var(--sn-border)',
            }}
        >
            {eyebrow && (
                <div
                    className="font-mono text-[10.5px] tracking-[0.18em] uppercase"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    {eyebrow}
                </div>
            )}
            <div className="flex items-center justify-between gap-3">
                {title && (
                    <h3
                        className="mt-1 text-[18px] font-semibold tracking-[-0.01em]"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {title}
                    </h3>
                )}
                {actions}
            </div>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function DashOverview({ user }: { user: AuthUser }) {
    const firstName = user.name.split(' ')[0];
    const nextEvent = EVENTS[0];
    const recentArticles = ARTICLES.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <div>
                <div
                    className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    // tableau de bord
                </div>
                <h1
                    className="mt-1 text-[36px] font-semibold tracking-[-0.02em]"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    Salaam, {firstName} 👋
                </h1>
                <p
                    className="mt-1 font-mono text-[13px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    Voici ce qui se passe dans ton coin de la communauté.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Articles publiés"
                    value="2"
                    delta="+1 ce mois"
                />
                <StatCard
                    label="Vues totales"
                    value="4 312"
                    delta="+18 % vs mois dernier"
                />
                <StatCard label="Évènements" value="4" delta="2 à venir" />
                <StatCard label="Réputation" value="742" delta="rang #14" />
            </div>

            {/* Next event */}
            <DashCard
                eyebrow="// prochain rendez-vous"
                title={nextEvent.title}
                actions={
                    <Link
                        href={`/evenements/${nextEvent.slug}`}
                        className="sn-btn sn-btn-ghost sn-btn-sm"
                    >
                        détails →
                    </Link>
                }
            >
                <div className="grid gap-4 font-mono text-[12.5px] sm:grid-cols-3">
                    <div>
                        <span style={{ color: 'var(--sn-muted)' }}>📅 </span>
                        {nextEvent.day} {nextEvent.month} {nextEvent.year} ·{' '}
                        {nextEvent.time}
                    </div>
                    <div>
                        <span style={{ color: 'var(--sn-muted)' }}>📍 </span>
                        {nextEvent.where}
                    </div>
                    <div style={{ color: 'var(--sn-600)' }}>
                        ● Inscription ouverte
                    </div>
                </div>
            </DashCard>

            {/* Activity + Recommendations */}
            <div className="grid gap-4 md:grid-cols-2">
                <DashCard
                    eyebrow="// activité récente"
                    title="Derniers évènements"
                >
                    <ul className="space-y-3 text-[13.5px]">
                        {[
                            [
                                'ven.',
                                'Tu as commenté ',
                                'Modèles sans N+1 : patterns éprouvés',
                            ],
                            [
                                'mer.',
                                'Khady a aimé ton article ',
                                'Pest 4 + GitHub Actions',
                            ],
                            [
                                'mar.',
                                "Tu t'es inscrit·e à ",
                                'Workshop : tests Pest + CI',
                            ],
                            [
                                'lun.',
                                'Tu as publié ',
                                'Pest 4 + GitHub Actions : pipeline complet',
                            ],
                        ].map(([day, action, subject], i) => (
                            <li key={i} className="flex gap-3">
                                <span
                                    className="w-10 shrink-0 font-mono text-[11px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {day}
                                </span>
                                <span style={{ color: 'var(--sn-fg)' }}>
                                    {action}
                                    <span className="font-medium">
                                        {subject}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </DashCard>

                <DashCard eyebrow="// suggestions" title="Recommandé pour toi">
                    <ul className="space-y-3">
                        {recentArticles.map((a) => (
                            <li key={a.slug} className="flex items-start gap-3">
                                <span
                                    className="mt-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] uppercase"
                                    style={{
                                        background: 'var(--sn-surface-2)',
                                        color: 'var(--sn-muted)',
                                    }}
                                >
                                    {a.tag}
                                </span>
                                <Link
                                    href={`/articles/${a.slug}`}
                                    className="flex-1 text-[13.5px] hover:underline"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {a.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </DashCard>
            </div>

            {/* Members spotlight */}
            <DashCard eyebrow="// membres actifs" title="La communauté">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {MEMBERS.slice(0, 6).map((m) => (
                        <div
                            key={m.slug}
                            className="flex items-center gap-3 rounded-lg p-3"
                            style={{
                                background: 'var(--sn-surface-2)',
                                border: '1px solid var(--sn-border)',
                            }}
                        >
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold"
                                style={{ background: m.tint, color: '#fff' }}
                            >
                                {m.init}
                            </div>
                            <div className="min-w-0">
                                <div
                                    className="truncate text-[13px] font-medium"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {m.name}
                                </div>
                                <div
                                    className="truncate font-mono text-[11px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {m.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DashCard>
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth?.user;

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title="Dashboard — Laravel Sénégal" />

            <div className="mx-auto max-w-[1300px] px-6 py-8 lg:px-10">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <DashSidebar section="overview" />
                    <main className="min-w-0">
                        <DashOverview user={user} />
                    </main>
                </div>
            </div>
        </>
    );
}
