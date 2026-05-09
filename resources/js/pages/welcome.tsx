import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ArticlesSection from '@/components/site/articles-section';
import type { ArticleSummary } from '@/types/article';
import CommandPalette from '@/components/site/command-palette';
import CtaSection from '@/components/site/cta-section';
import EventsSection from '@/components/site/events-section';
import MobileSheet from '@/components/site/mobile-sheet';
import OpenSourceSection from '@/components/site/open-source-section';
import SiteFooter from '@/components/site/site-footer';
import SiteHero from '@/components/site/site-hero';
import SiteNavbar from '@/components/site/site-navbar';
import SponsorsSection from '@/components/site/sponsors-section';

export default function Welcome() {
    const { auth, latestArticles } = usePage().props as {
        auth: { user: { name: string } | null };
        latestArticles: ArticleSummary[];
    };
    const [cmdOpen, setCmdOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
        <>
            <Head>
                <title>
                    Laravel Sénégal — Communauté des développeurs Laravel
                </title>
                <meta
                    name="description"
                    content="La communauté francophone des développeurs Laravel au Sénégal. Articles, meetups, podcast, ressources — en français, depuis Dakar."
                />
                <meta property="og:title" content="Laravel Sénégal" />
                <meta
                    property="og:description"
                    content="500+ développeurs Laravel au Sénégal. Articles, événements, open source."
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <div className="sn-page min-h-screen">
                <SiteNavbar
                    onOpenCmd={() => setCmdOpen(true)}
                    onOpenMenu={() => setMenuOpen(true)}
                    active="home"
                />

                <main>
                    <SiteHero onOpenCmd={() => setCmdOpen(true)} />
                    <SponsorsSection />
                    <ArticlesSection articles={latestArticles} />
                    <EventsSection />
                    <OpenSourceSection />
                    <CtaSection />
                </main>

                <SiteFooter />

                <CommandPalette
                    open={cmdOpen}
                    onClose={() => setCmdOpen(false)}
                />
                <MobileSheet
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    isLoggedIn={!!auth?.user}
                />
            </div>
        </>
    );
}
