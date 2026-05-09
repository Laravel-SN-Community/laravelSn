import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    CalendarDays,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    UserCircle,
} from 'lucide-react';
import { logout } from '@/routes';

interface AuthUser {
    name: string;
    email: string;
}

const SECTIONS = [
    {
        id: 'overview',
        label: "Vue d'ensemble",
        Icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        id: 'profile',
        label: 'Mon profil',
        Icon: UserCircle,
        href: '/dashboard/profile',
    },
    {
        id: 'articles',
        label: 'Mes articles',
        Icon: FileText,
        href: '/dashboard/articles',
    },
    {
        id: 'events',
        label: 'Mes inscriptions',
        Icon: CalendarDays,
        href: '/dashboard/events',
    },
    {
        id: 'notifications',
        label: 'Notifications',
        Icon: Bell,
        href: '/dashboard/notifications',
    },
    {
        id: 'settings',
        label: 'Paramètres',
        Icon: Settings,
        href: '/dashboard/settings',
    },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

const TINTS = ['#0f7b4d', '#188a5c', '#0b6640', '#3ea777'];

function getTint(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return TINTS[Math.abs(hash) % TINTS.length];
}

export default function DashSidebar({ section }: { section: SectionId }) {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth?.user;

    if (!user) {
        return null;
    }

    const init = getInitials(user.name);
    const tint = getTint(user.name);

    function handleLogout() {
        router.post(logout());
    }

    return (
        <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
                className="mb-3 rounded-xl p-4"
                style={{
                    background: 'var(--sn-surface)',
                    border: '1px solid var(--sn-border)',
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold tracking-wide"
                        style={{ background: tint, color: '#fff' }}
                    >
                        {init}
                    </div>
                    <div className="min-w-0">
                        <div
                            className="truncate text-[14px] font-semibold"
                            style={{ color: 'var(--sn-fg)' }}
                        >
                            {user.name}
                        </div>
                        <div
                            className="truncate text-[11.5px]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>

            <nav className="space-y-0.5">
                {SECTIONS.map((s) => {
                    const active = s.id === section;

                    return (
                        <Link
                            key={s.id}
                            href={s.href}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors"
                            style={{
                                background: active
                                    ? 'var(--sn-surface-2)'
                                    : 'transparent',
                                color: active
                                    ? 'var(--sn-fg)'
                                    : 'var(--sn-muted)',
                            }}
                        >
                            <s.Icon
                                size={15}
                                strokeWidth={active ? 2 : 1.5}
                                style={{
                                    color: active ? 'var(--sn-600)' : 'inherit',
                                    flexShrink: 0,
                                }}
                            />
                            {s.label}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors"
                style={{ color: 'var(--destructive)' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                }}
            >
                <LogOut size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                Se déconnecter
            </button>
        </aside>
    );
}
