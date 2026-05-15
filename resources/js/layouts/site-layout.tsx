import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import CommandPalette from '@/components/site/command-palette';
import MobileSheet from '@/components/site/mobile-sheet';
import SiteFooter from '@/components/site/site-footer';
import SiteNavbar from '@/components/site/site-navbar';

export default function SiteLayout({ children }: { children: ReactNode }) {
    const page = usePage();
    const auth = (page.props as { auth?: { user: { name: string } | null } })
        .auth;
    const url: string = (page as unknown as { url: string }).url;

    const [cmdOpen, setCmdOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const activeKey = url.startsWith('/articles')
        ? 'articles'
        : url.startsWith('/events')
          ? 'events'
          : url.startsWith('/forum')
            ? 'forum'
            : 'home';

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setCmdOpen((c) => !c);
            }
        };
        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className="sn-page min-h-screen">
            <SiteNavbar
                active={activeKey}
                onOpenCmd={() => setCmdOpen(true)}
                onOpenMenu={() => setMenuOpen(true)}
            />
            <main>{children}</main>
            <SiteFooter />
            <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
            <MobileSheet
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                isLoggedIn={!!auth?.user}
            />
        </div>
    );
}
