import { Head } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';

const BENEFITS = [
    "Groupe WhatsApp actif — 500+ développeurs, réponses en moins d'une heure",
    'Serveur Discord structuré — canaux par technologie, code reviews, #jobs',
    'Accès aux meetups mensuels à Dakar avec replay vidéo',
    "Newsletter mensuelle : liens, tutos, offres d'emploi curatés",
    'Accès aux repos open source de la communauté (laravel-sn)',
    'Mise en relation pour missions freelance et recrutements CDI',
];

const CHANNELS = [
    { name: '#général', desc: 'Actualités, liens, discussions quotidiennes' },
    {
        name: '#entraide',
        desc: 'Questions Laravel, debug collectif, solutions',
    },
    { name: '#jobs', desc: 'Offres CDI et freelance, profils disponibles' },
    {
        name: '#projets',
        desc: 'Présenter son projet, trouver des collaborateurs',
    },
    {
        name: '#ressources',
        desc: 'Articles, tutos, outils partagés par la commu',
    },
    { name: '#code-review', desc: 'Soumettre du code pour review collective' },
];

export default function Rejoindre() {
    return (
        <>
            <Head title="Rejoindre — Laravel Sénégal" />

            <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-24 lg:px-10">
                {/* Hero */}
                <div className="mb-16 max-w-[640px]">
                    <div
                        className="font-mono text-[11.5px] tracking-[0.2em] uppercase"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        // rejoindre · gratuit · sans spam
                    </div>
                    <h1
                        className="mt-3 text-[44px] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[52px]"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        La communauté{' '}
                        <span style={{ color: 'var(--sn-accent)' }}>
                            Laravel
                        </span>{' '}
                        du Sénégal t'attend.
                    </h1>
                    <p
                        className="mt-4 text-[16px] leading-[1.65]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        500+ développeurs Laravel au Sénégal et en diaspora.
                        Entraide, événements, code reviews et offres d'emploi —
                        en français, gratuitement.
                    </p>

                    {/* Stats */}
                    <div
                        className="mt-8 flex flex-wrap gap-6 border-t pt-6"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        {[
                            ['500+', 'développeurs'],
                            ['8', 'meetups organisés'],
                            ['2021', 'année de création'],
                            ['6', 'packages open source'],
                        ].map(([n, l]) => (
                            <div key={l}>
                                <div
                                    className="font-mono text-[24px] tracking-tight"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    {n}
                                </div>
                                <div
                                    className="text-[12px] tracking-wider uppercase"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {l}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Join options */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* WhatsApp */}
                    <div
                        className="flex flex-col gap-5 rounded-[16px] p-7"
                        style={{
                            background: 'var(--sn-surface)',
                            border: '1px solid var(--sn-border)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{
                                    background:
                                        'color-mix(in oklch, #25d366 14%, transparent)',
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="#25d366"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.856L.057 23.625a.375.375 0 0 0 .458.464l5.884-1.543A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.72 9.72 0 0 1-4.95-1.352l-.353-.21-3.65.957.975-3.563-.232-.366A9.694 9.694 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                                </svg>
                            </div>
                            <div>
                                <div
                                    className="font-semibold"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    WhatsApp
                                </div>
                                <div
                                    className="text-[12.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    500+ membres actifs
                                </div>
                            </div>
                        </div>
                        <p
                            className="text-[13.5px] leading-relaxed"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Le canal principal de la communauté. Discussions en
                            temps réel, partage de liens, annonces d'événements
                            et entraide quotidienne. Idéal pour les échanges
                            rapides.
                        </p>
                        <a
                            href="https://chat.whatsapp.com/laravel-sn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sn-btn sn-btn-primary w-full justify-center"
                        >
                            Rejoindre le groupe WhatsApp{' '}
                            <ArrowRight size={14} />
                        </a>
                    </div>

                    {/* Discord */}
                    <div
                        className="flex flex-col gap-5 rounded-[16px] p-7"
                        style={{
                            background: 'var(--sn-surface)',
                            border: '1px solid var(--sn-border)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{
                                    background:
                                        'color-mix(in oklch, #5865f2 14%, transparent)',
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="#5865f2"
                                >
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                            </div>
                            <div>
                                <div
                                    className="font-semibold"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    Discord
                                </div>
                                <div
                                    className="text-[12.5px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    Canaux thématiques
                                </div>
                            </div>
                        </div>
                        <p
                            className="text-[13.5px] leading-relaxed"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            Le serveur structuré pour les discussions
                            techniques. Chaque technologie a son canal. Idéal
                            pour les code reviews et les questions approfondies.
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                            {CHANNELS.map((c) => (
                                <div
                                    key={c.name}
                                    className="flex items-start gap-1.5"
                                >
                                    <span
                                        className="mt-0.5 shrink-0 font-mono text-[11px]"
                                        style={{ color: 'var(--sn-accent)' }}
                                    >
                                        {c.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <a
                            href="https://discord.gg/laravel-sn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sn-btn sn-btn-secondary w-full justify-center"
                        >
                            Rejoindre le Discord <ArrowRight size={14} />
                        </a>
                    </div>
                </div>

                {/* Benefits */}
                <div
                    className="mt-12 rounded-[16px] p-8"
                    style={{
                        background: 'var(--sn-surface)',
                        border: '1px solid var(--sn-border)',
                    }}
                >
                    <div
                        className="mb-6 font-mono text-[11.5px] tracking-[0.2em] uppercase"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        // ce que tu obtiens
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {BENEFITS.map((b, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span
                                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background:
                                            'color-mix(in oklch, var(--sn-accent) 14%, transparent)',
                                        color: 'var(--sn-accent)',
                                    }}
                                >
                                    <Check size={11} />
                                </span>
                                <span
                                    className="text-[13.5px] leading-relaxed"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    {b}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
