import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { login } from '@/routes';
import ThemeToggle from './theme-toggle';

interface SiteNavbarProps {
    onOpenCmd: () => void;
    onOpenMenu: () => void;
    active?: string;
}

const navLinks = [
    { label: 'Articles', href: '/articles', key: 'articles' },
    { label: 'Forum', href: '/forum', key: 'forum' },
    { label: 'Événements', href: '/evenements', key: 'evenements' },
];

export default function SiteNavbar({
    onOpenCmd,
    onOpenMenu,
    active = 'home',
}: SiteNavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const { auth } = usePage().props as {
        auth: { user: { name: string } | null };
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className="sticky top-0 z-30"
            style={{
                background: scrolled
                    ? 'color-mix(in oklch, var(--sn-bg) 78%, transparent)'
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
                WebkitBackdropFilter: scrolled
                    ? 'blur(14px) saturate(1.2)'
                    : 'none',
                borderBottom: `1px solid ${scrolled ? 'var(--sn-border)' : 'transparent'}`,
                transition: 'background 200ms, border-color 200ms',
            }}
        >
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-6 lg:px-10">
                {/* Left: logo + nav */}
                <div className="flex min-w-0 items-center gap-8">
                    <a
                        href="/"
                        className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        <img
                            src="/logo.png"
                            alt="Laravel SN"
                            className="h-7 w-7 object-contain"
                        />
                        <span>
                            laravel
                            <span style={{ color: 'var(--sn-accent)' }}>.</span>
                            sn
                        </span>
                    </a>
                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map((l) => (
                            <Link
                                key={l.key}
                                href={l.href}
                                className={`sn-navlink${active === l.key ? 'active' : ''}`}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: search + theme + auth */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenCmd}
                        className="hidden w-[260px] items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] sm:flex"
                        style={{
                            background: 'var(--sn-surface)',
                            border: '1px solid var(--sn-border)',
                            color: 'var(--sn-muted)',
                        }}
                        aria-label="Recherche"
                    >
                        <Search size={13} />
                        <span className="flex-1 text-left">Recherche…</span>
                        <span
                            className="rounded px-1.5 py-0.5 font-mono text-[10.5px]"
                            style={{
                                background: 'var(--sn-surface-2)',
                                color: 'var(--sn-muted)',
                            }}
                        >
                            ⌘K
                        </span>
                    </button>

                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {auth?.user ? (
                        <Link
                            href="/dashboard"
                            className="sn-btn sn-btn-sm sn-btn-secondary hidden sm:inline-flex"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="sn-btn sn-btn-sm sn-btn-primary hidden sm:inline-flex"
                        >
                            Se connecter <ArrowRight size={13} />
                        </Link>
                    )}

                    <div className="md:hidden">
                        <button
                            className="sn-btn sn-btn-sm sn-btn-secondary"
                            onClick={onOpenMenu}
                            aria-label="Menu"
                        >
                            <Menu size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
