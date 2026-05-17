import { Head, Link } from '@inertiajs/react';

const messages: Record<number, { title: string; subtitle: string }> = {
    403: {
        title: 'Accès refusé.',
        subtitle: "// tu n'as pas les droits pour accéder à cette ressource",
    },
    404: {
        title: "Cette page n'existe pas (encore).",
        subtitle:
            '// route not found · php artisan route:list ne te sauvera pas cette fois',
    },
    500: {
        title: 'Erreur serveur.',
        subtitle:
            "// quelque chose s'est mal passé côté serveur — réessaie dans un instant",
    },
    503: {
        title: 'Service indisponible.',
        subtitle: '// maintenance en cours · on revient bientôt',
    },
};

export default function Error({ status }: { status: number }) {
    const { title, subtitle } = messages[status] ?? {
        title: 'Une erreur est survenue.',
        subtitle: `// HTTP ${status}`,
    };

    return (
        <>
            <Head title={`${status} — Laravel Sénégal`} />

            <div className="mx-auto max-w-175 px-6 py-32 text-center">
                {/* Eyebrow */}
                <div
                    className="font-mono text-[13px] tracking-[0.25em] uppercase"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    // erreur {status}
                </div>

                {/* Big status number */}
                <div
                    className="mt-4 text-[clamp(80px,15vw,120px)] leading-none font-semibold tracking-[-0.04em]"
                    style={{ color: 'var(--sn-700)' }}
                >
                    {String(status).split('').join('·')}
                </div>

                {/* Title */}
                <h1
                    className="mt-2 text-[28px] font-semibold tracking-[-0.015em]"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    {title}
                </h1>

                {/* Subtitle */}
                <p
                    className="mt-3 font-mono text-[13.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    {subtitle}
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    <Link href="/" className="sn-btn sn-btn-primary">
                        ← Accueil
                    </Link>
                    <Link href="/articles" className="sn-btn sn-btn-secondary">
                        Articles
                    </Link>
                    <Link href="/events" className="sn-btn sn-btn-secondary">
                        Évènements
                    </Link>
                </div>
            </div>
        </>
    );
}
