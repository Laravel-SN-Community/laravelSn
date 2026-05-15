import { Link } from '@inertiajs/react';
import { ArrowRight, X } from 'lucide-react';
import { login } from '@/routes';
import ThemeToggle from './theme-toggle';

interface MobileSheetProps {
    open: boolean;
    onClose: () => void;
    isLoggedIn?: boolean;
}

const links = [
    { label: 'Articles', href: '/articles' },
    { label: 'Forum', href: '/forum' },
    { label: 'Événements', href: '/events' },
    { label: 'Rejoindre', href: '/rejoindre' },
];

export default function MobileSheet({
    open,
    onClose,
    isLoggedIn = false,
}: MobileSheetProps) {
    if (!open) {
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
                    background: 'rgba(12,20,18,.6)',
                    animation: 'sn-overlay-in .2s var(--sn-ease) both',
                }}
                onClick={onClose}
            />

            {/* Sheet */}
            <aside
                className="absolute top-0 right-0 bottom-0 w-[86%] max-w-sm p-6"
                style={{
                    background: 'var(--sn-bg)',
                    borderLeft: '1px solid var(--sn-border)',
                    animation: 'sn-dialog-in .25s var(--sn-ease) both',
                }}
            >
                <div className="mb-8 flex items-center justify-between">
                    <span
                        className="font-semibold"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        laravel
                        <span style={{ color: 'var(--sn-accent)' }}>.</span>sn
                    </span>
                    <button
                        className="sn-btn sn-btn-sm sn-btn-ghost"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={onClose}
                            className="border-b py-2.5 text-[16px] font-medium"
                            style={{
                                borderColor: 'var(--sn-border)',
                                color: 'var(--sn-fg)',
                            }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 flex items-center justify-between">
                    <span
                        className="text-[12px] tracking-wider uppercase"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        Thème
                    </span>
                    <ThemeToggle />
                </div>

                {isLoggedIn ? (
                    <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="sn-btn sn-btn-primary mt-6 w-full justify-center"
                    >
                        Mon dashboard <ArrowRight size={14} />
                    </Link>
                ) : (
                    <Link
                        href={login()}
                        onClick={onClose}
                        className="sn-btn sn-btn-primary mt-6 w-full justify-center"
                    >
                        Se connecter <ArrowRight size={14} />
                    </Link>
                )}
            </aside>
        </div>
    );
}
