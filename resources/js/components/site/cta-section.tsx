export default function CtaSection() {
    return (
        <section className="mx-auto mt-24 max-w-[1400px] px-6 lg:px-10">
            <div
                className="sn-cta-bg relative overflow-hidden rounded-[16px] p-10 md:p-14"
                style={{ color: '#fff' }}
            >
                {/* Grid overlay */}
                <div
                    className="bg-sn-grid pointer-events-none absolute inset-0 opacity-[0.07]"
                    aria-hidden
                />

                {/* Glow */}
                <div
                    className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
                    aria-hidden
                    style={{
                        background:
                            'radial-gradient(closest-side, var(--sn-400), transparent 70%)',
                    }}
                />

                <div className="relative grid items-center gap-8 lg:grid-cols-12">
                    {/* Copy */}
                    <div className="lg:col-span-8">
                        <div
                            className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 font-mono text-[11.5px] tracking-[0.14em] uppercase"
                            style={{
                                border: '1px solid rgba(255,255,255,.15)',
                                color: 'rgba(255,255,255,.7)',
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ background: 'var(--sn-400)' }}
                            />
                            rejoindre · gratuit · sans spam
                        </div>

                        <h2 className="mt-5 max-w-[22ch] text-[34px] leading-[1.05] font-semibold tracking-[-0.02em] sm:text-[42px]">
                            Du code{' '}
                            <span style={{ color: 'var(--sn-400)' }}>
                                Laravel
                            </span>{' '}
                            propre, en français, entre voisins.
                        </h2>

                        <p
                            className="mt-4 max-w-[52ch] text-[15px] leading-relaxed"
                            style={{ color: 'rgba(255,255,255,.72)' }}
                        >
                            Rejoins 500+ développeurs sur WhatsApp et Discord.
                            Événements mensuels, code reviews, offres d'emploi,
                            entraide — le tout en français.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-3 lg:col-span-4">
                        <a
                            href="https://chat.whatsapp.com/laravel-sn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sn-btn sn-btn-primary w-full justify-center"
                        >
                            {/* WhatsApp icon */}
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.856L.057 23.625a.375.375 0 0 0 .458.464l5.884-1.543A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.72 9.72 0 0 1-4.95-1.352l-.353-.21-3.65.957.975-3.563-.232-.366A9.694 9.694 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                            </svg>
                            Rejoindre WhatsApp
                        </a>

                        <a
                            href="https://discord.gg/laravel-sn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sn-btn w-full justify-center"
                            style={{
                                background: 'rgba(255,255,255,.08)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,.15)',
                            }}
                        >
                            {/* Discord icon */}
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            Rejoindre Discord
                        </a>

                        <span
                            className="text-center font-mono text-[11px]"
                            style={{ color: 'rgba(255,255,255,.5)' }}
                        >
                            ou ·{' '}
                            <a
                                href="https://github.com/laravel-sn"
                                className="underline hover:text-white"
                            >
                                GitHub
                            </a>{' '}
                            ·{' '}
                            <a
                                href="/newsletter"
                                className="underline hover:text-white"
                            >
                                Newsletter
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
