import { Link } from '@inertiajs/react';
import ThemeToggle from '@/components/site/theme-toggle';
import type { AuthLayoutProps } from '@/types';

export default function AuthLayout({
    title = '',
    description = '',
    eyebrow = '',
    children,
}: AuthLayoutProps) {
    return (
        <div
            className="grid min-h-screen lg:grid-cols-2"
            style={{ background: 'var(--sn-bg)' }}
        >
            {/* Left panel — desktop only */}
            <div
                className="relative hidden flex-col justify-between overflow-hidden p-14 lg:flex"
                style={{ background: 'var(--sn-700)', color: '#fff' }}
            >
                {/* Decorative grid */}
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                        WebkitMaskImage:
                            'linear-gradient(to bottom right, black 30%, transparent 100%)',
                        maskImage:
                            'linear-gradient(to bottom right, black 30%, transparent 100%)',
                    }}
                />

                {/* Logo */}
                <div className="relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 text-[17px] font-semibold text-white"
                    >
                        <img
                            src="/logo.png"
                            alt="Laravel SN"
                            className="h-8 w-8 object-contain"
                        />
                        laravel
                        <span style={{ color: 'rgba(255,255,255,0.40)' }}>
                            .
                        </span>
                        sn
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10">
                    <h2
                        className="text-[34px] leading-[1.12] font-semibold tracking-tight"
                        style={{ color: '#fff' }}
                    >
                        Rejoins la communauté
                        <br />
                        Laravel du Sénégal.
                    </h2>
                    <p
                        className="mt-5 max-w-[34ch] text-[15px] leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                        On partage, on apprend, on découvre,
                        <br />
                        et on construit ensemble.
                    </p>
                </div>

                {/* Footer */}
                <div
                    className="relative z-10 font-mono text-[11.5px]"
                    style={{ color: 'rgba(255,255,255,0.30)' }}
                >
                    laravel.sn — communauté depuis 2021
                </div>
            </div>

            {/* Right panel — form */}
            <div
                className="flex min-h-screen flex-col justify-center px-6 py-12 lg:min-h-0 lg:px-16"
                style={{ background: 'var(--sn-bg)' }}
            >
                <div className="mx-auto w-full max-w-[420px]">
                    {/* Mobile header */}
                    <div className="mb-10 flex items-center justify-between lg:hidden">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[15px] font-semibold"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            <img
                                src="/logo.png"
                                alt="Laravel SN"
                                className="h-6 w-6 object-contain"
                            />
                            laravel
                            <span style={{ color: 'var(--sn-accent)' }}>.</span>
                            sn
                        </Link>
                        <ThemeToggle />
                    </div>

                    {/* Eyebrow */}
                    {eyebrow && (
                        <div
                            className="mb-3 font-mono text-[11.5px] tracking-[0.2em] uppercase"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            {eyebrow}
                        </div>
                    )}

                    {/* Title */}
                    <h1
                        className="mb-1 text-[28px] font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {title}
                    </h1>

                    {/* Description */}
                    {description && (
                        <p
                            className="mb-8 text-[13.5px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            {description}
                        </p>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}
