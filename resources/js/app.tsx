import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SiteLayout from '@/layouts/site-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'error':
                return SiteLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return SiteLayout;
            case name.startsWith('dashboard/'):
                return SiteLayout;
            case name.startsWith('articles/'):
                return SiteLayout;
            case name.startsWith('evenements/'):
                return SiteLayout;
            case name.startsWith('forum/'):
                return SiteLayout;
            case name.startsWith('membres/'):
                return SiteLayout;
            case name.startsWith('ressources/'):
                return SiteLayout;
            case name === 'rejoindre':
                return SiteLayout;
            case name === 'rules':
                return SiteLayout;
            case name === 'terms':
                return SiteLayout;
            case name === 'privacy':
                return SiteLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
