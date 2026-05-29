import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    LayoutDashboard,
    LogOut,
    Search,
    Settings,
    ShieldCheck,
    UserCircle,
    UserCog,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import SiteWordmark from '@/components/site/site-wordmark';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { login, logout } from '@/routes';

interface SiteNavbarProps {
    onOpenCmd: () => void;
    onOpenMenu: () => void;
    active?: string;
}

const navLinks = [
    { label: 'Articles', href: '/articles', key: 'articles' },
    { label: 'Forum', href: '/forum', key: 'forum' },
    { label: 'Événements', href: '/events', key: 'events' },
];

const TINTS = ['#0f7b4d', '#188a5c', '#0b6640', '#3ea777'];

function getTint(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return TINTS[Math.abs(hash) % TINTS.length];
}

export default function SiteNavbar({
    onOpenCmd,
    onOpenMenu,
    active = 'home',
}: SiteNavbarProps) {
    const headerRef = useRef<HTMLElement>(null);
    const getInitials = useInitials();
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                email: string;
                avatar?: string;
            } | null;
            role?: string | null;
        };
    };

    useEffect(() => {
        const el = headerRef.current;

        if (!el) {
            return;
        }

        const onScroll = () => {
            const s = window.scrollY > 4;
            el.style.background = s
                ? 'color-mix(in oklch, var(--sn-bg) 78%, transparent)'
                : 'transparent';
            el.style.backdropFilter = s ? 'blur(14px) saturate(1.2)' : 'none';
            (
                el.style as CSSStyleDeclaration & {
                    WebkitBackdropFilter: string;
                }
            ).WebkitBackdropFilter = s ? 'blur(14px) saturate(1.2)' : 'none';
            el.style.borderBottom = `1px solid ${s ? 'var(--sn-border)' : 'transparent'}`;
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed inset-x-0 top-0 z-30"
            style={{ transition: 'background 200ms, border-color 200ms' }}
        >
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-6 lg:px-10">
                {/* Left: logo + nav */}
                <div className="flex min-w-0 items-center gap-8">
                    <Link href="/" className="shrink-0">
                        <SiteWordmark />
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map((l) => (
                            <Link
                                key={l.key}
                                href={l.href}
                                className={[
                                    'sn-navlink',
                                    active === l.key ? 'active' : '',
                                ].join(' ')}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: search + auth */}
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

                    {auth?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ring-2 ring-transparent transition-all hover:ring-[var(--sn-border)] focus:outline-none sm:flex"
                                    style={{
                                        background: auth.user.avatar
                                            ? 'transparent'
                                            : getTint(auth.user.name),
                                        color: '#fff',
                                        overflow: 'hidden',
                                    }}
                                    aria-label="Menu utilisateur"
                                >
                                    {auth.user.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitials(auth.user.name)
                                    )}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5">
                                    <p
                                        className="flex items-center gap-1.5 text-[13px] font-medium"
                                        style={{ color: 'var(--sn-fg)' }}
                                    >
                                        <span className="truncate">
                                            {auth.user.name}
                                        </span>
                                        {auth.role === 'admin' && (
                                            <span
                                                title="Administrateur"
                                                className="inline-flex shrink-0"
                                            >
                                                <ShieldCheck
                                                    size={13}
                                                    style={{
                                                        color: 'var(--sn-accent)',
                                                    }}
                                                />
                                            </span>
                                        )}
                                        {auth.role === 'moderator' && (
                                            <span
                                                title="Modérateur"
                                                className="inline-flex shrink-0"
                                            >
                                                <UserCog
                                                    size={13}
                                                    style={{
                                                        color: 'var(--sn-accent)',
                                                    }}
                                                />
                                            </span>
                                        )}
                                    </p>
                                    <p
                                        className="truncate text-[11.5px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        {auth.user.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard"
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <LayoutDashboard size={14} />
                                        Tableau de bord
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard/profile"
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <UserCircle size={14} />
                                        Mon profil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard/settings"
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <Settings size={14} />
                                        Paramètres
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    style={{ color: 'var(--destructive)' }}
                                    onClick={() => router.post(logout())}
                                >
                                    <LogOut size={14} />
                                    Se déconnecter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden sm:block">
                            <Link
                                href={login()}
                                className="sn-btn sn-btn-sm sn-btn-primary"
                            >
                                Se connecter <ArrowRight size={13} />
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-1 md:hidden">
                        <button
                            onClick={onOpenCmd}
                            aria-label="Recherche"
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[color:var(--sn-surface-2)]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            <Search size={18} />
                        </button>
                        <button
                            onClick={onOpenMenu}
                            aria-label="Menu"
                            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-[color:var(--sn-surface-2)]"
                        >
                            <span
                                className="block h-[1.5px] w-[18px] rounded-full transition-all"
                                style={{ background: 'var(--sn-fg)' }}
                            />
                            <span
                                className="ml-[5px] block h-[1.5px] w-[11px] self-start rounded-full transition-all"
                                style={{ background: 'var(--sn-fg)' }}
                            />
                            <span
                                className="block h-[1.5px] w-[18px] rounded-full transition-all"
                                style={{ background: 'var(--sn-fg)' }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
