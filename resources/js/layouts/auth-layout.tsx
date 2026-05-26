import { Link } from '@inertiajs/react';
import SiteWordmark from '@/components/site/site-wordmark';
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
            {/* ── Left panel — desktop only ── */}
            <div
                className="relative hidden flex-col justify-between overflow-hidden p-14 lg:flex"
                style={{ background: '#071912' }}
            >
                {/* Grid lines */}
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
                        backgroundSize: '72px 72px',
                    }}
                />

                {/* Radial glow — bottom-left anchor */}
                <div
                    aria-hidden
                    className="absolute bottom-0 left-0"
                    style={{
                        width: '520px',
                        height: '520px',
                        background:
                            'radial-gradient(ellipse at bottom left, rgba(15,123,77,0.28) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Top-right subtle glow */}
                <div
                    aria-hidden
                    className="absolute top-0 right-0"
                    style={{
                        width: '300px',
                        height: '300px',
                        background:
                            'radial-gradient(ellipse at top right, rgba(62,167,119,0.08) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex">
                        <div
                            style={
                                {
                                    '--sn-fg': '#ffffff',
                                    '--sn-accent': 'rgba(255,255,255,0.55)',
                                } as React.CSSProperties
                            }
                        >
                            <SiteWordmark logoSize="md" />
                        </div>
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10">
                    {/* Decorative slash */}
                    <div
                        className="mb-6 text-[11px] tracking-[0.22em] uppercase"
                        style={{ color: 'rgba(255,255,255,0.28)' }}
                    >
                        communauté
                    </div>

                    <h2
                        className="text-[38px] leading-[1.08] font-bold tracking-tight"
                        style={{ color: '#fff' }}
                    >
                        Rejoins la communauté
                        <br />
                        <span
                            style={{
                                color: 'var(--sn-400, #3ea777)',
                            }}
                        >
                            Laravel
                        </span>{' '}
                        du Sénégal.
                    </h2>

                    <p
                        className="mt-6 max-w-[32ch] text-[14.5px] leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                        On partage, on apprend, on découvre,
                        <br />
                        et on construit ensemble.
                    </p>

                    {/* Accent rule */}
                    <div
                        className="mt-8 h-px w-12"
                        style={{
                            background:
                                'linear-gradient(to right, rgba(62,167,119,0.7), transparent)',
                        }}
                    />
                </div>

                {/* Footer */}
                <div
                    className="relative z-10 text-[11px]"
                    style={{ color: 'rgba(255,255,255,0.22)' }}
                >
                    laravel.sn — communauté depuis 2021
                </div>
            </div>

            {/* ── Right panel — form ── */}
            <div
                className="flex min-h-screen flex-col justify-center px-6 py-12 lg:min-h-0 lg:px-16"
                style={{ background: 'var(--sn-bg)' }}
            >
                <div className="mx-auto w-full max-w-[420px]">
                    {/* Mobile header */}
                    <div className="mb-10 lg:hidden">
                        <Link href="/">
                            <SiteWordmark />
                        </Link>
                    </div>

                    {/* Eyebrow */}
                    {eyebrow && (
                        <div
                            className="mb-3 text-[11.5px] tracking-[0.2em] uppercase"
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
