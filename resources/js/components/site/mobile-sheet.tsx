import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    UserCog,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import SiteWordmark from '@/components/site/site-wordmark';
import { useInitials } from '@/hooks/use-initials';
import { login, logout } from '@/routes';

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface MobileSheetProps {
    open: boolean;
    onClose: () => void;
    user?: User | null;
    role?: string | null;
}

const links = [
    { label: 'Articles', href: '/articles' },
    { label: 'Forum', href: '/forum' },
    { label: 'Événements', href: '/events' },
];

const TINTS = ['#0f7b4d', '#188a5c', '#0b6640', '#3ea777'];

function getTint(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return TINTS[Math.abs(hash) % TINTS.length];
}

export default function MobileSheet({
    open,
    onClose,
    user = null,
    role = null,
}: MobileSheetProps) {
    const getInitials = useInitials();
    const { url } = usePage();
    const [prevOpen, setPrevOpen] = useState(open);
    const [rendered, setRendered] = useState(open);
    const [closing, setClosing] = useState(false);

    if (prevOpen !== open) {
        setPrevOpen(open);

        if (open) {
            setRendered(true);
            setClosing(false);
        } else if (rendered) {
            setClosing(true);
        }
    }

    useEffect(() => {
        if (!closing) {
            return;
        }

        const t = setTimeout(() => {
            setRendered(false);
            setClosing(false);
        }, 260);

        return () => clearTimeout(t);
    }, [closing]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!rendered) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'rgba(8,16,14,.55)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    animation: closing
                        ? 'sn-overlay-out .26s var(--sn-ease) both'
                        : 'sn-overlay-in .2s var(--sn-ease) both',
                }}
                onClick={onClose}
            />

            {/* Floating card */}
            <div
                className="absolute top-0 right-0 left-0 px-4 pt-4"
                style={{
                    animation: closing
                        ? 'sn-sheet-up-out .26s var(--sn-ease) both'
                        : 'sn-sheet-down .28s var(--sn-ease) both',
                }}
            >
                <div
                    className="overflow-hidden rounded-2xl"
                    style={{
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                        boxShadow:
                            '0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.1)',
                    }}
                >
                    {/* Header: logo + close */}
                    <div
                        className="flex items-center justify-between px-5 pt-5 pb-4"
                        style={{ borderBottom: '1px solid var(--sn-border)' }}
                    >
                        <a href="/" onClick={onClose}>
                            <SiteWordmark />
                        </a>
                        <button
                            className="sn-btn sn-btn-sm sn-btn-ghost"
                            onClick={onClose}
                            aria-label="Fermer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="px-2 py-2">
                        {links.map((l) => {
                            const isActive = url.startsWith(l.href);

                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    onClick={onClose}
                                    className="flex items-center rounded-xl px-3 py-3 text-[16px] font-medium transition-all"
                                    style={{
                                        color: isActive
                                            ? 'var(--sn-accent)'
                                            : 'var(--sn-fg)',
                                        background: isActive
                                            ? 'color-mix(in oklch, var(--sn-accent) 8%, transparent)'
                                            : 'transparent',
                                    }}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer: auth */}
                    <div
                        className="px-4 pt-1 pb-4"
                        style={{ borderTop: '1px solid var(--sn-border)' }}
                    >
                        {user ? (
                            <div className="mt-3">
                                {/* User row */}
                                <div className="mb-3 flex items-center gap-3">
                                    <div
                                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                                        style={{
                                            background: user.avatar
                                                ? undefined
                                                : getTint(user.name),
                                        }}
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div
                                            className="flex items-center gap-1.5 text-[13px] font-semibold"
                                            style={{ color: 'var(--sn-fg)' }}
                                        >
                                            <span className="truncate">
                                                {user.name}
                                            </span>
                                            {role === 'admin' && (
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
                                            {role === 'moderator' && (
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
                                        </div>
                                        <div
                                            className="truncate text-[11px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <Link
                                        href="/dashboard"
                                        onClick={onClose}
                                        className="sn-btn sn-btn-sm sn-btn-secondary flex-1 justify-center"
                                    >
                                        <LayoutDashboard size={13} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            router.post(logout());
                                        }}
                                        className="sn-btn sn-btn-sm sn-btn-ghost"
                                        style={{ color: 'var(--destructive)' }}
                                        aria-label="Se déconnecter"
                                    >
                                        <LogOut size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href={login()}
                                onClick={onClose}
                                className="sn-btn sn-btn-primary mt-3 w-full justify-center"
                            >
                                Se connecter <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
