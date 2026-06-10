import { Head } from '@inertiajs/react';
import SiteWordmark from '@/components/site/site-wordmark';

/**
 * Standalone maintenance page — rendered without any site layout so no
 * navbar, footer or navigation leaks while the app is down.
 */
export default function Maintenance() {
    return (
        <>
            <Head title="Maintenance — Laravel Sénégal" />

            <div
                className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
                style={{ background: 'var(--sn-bg)' }}
            >
                <SiteWordmark logoSize="lg" />

                <div
                    className="mt-12 inline-flex items-center gap-2 font-mono text-[13px] tracking-[0.25em] uppercase"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <span
                        className="h-2 w-2 animate-pulse rounded-full"
                        style={{ background: 'var(--sn-700)' }}
                    />
                    maintenance en cours
                </div>

                <h1
                    className="mt-4 text-[clamp(26px,5vw,40px)] font-semibold tracking-[-0.02em]"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    On revient très vite.
                </h1>

                <p
                    className="mt-3 font-mono text-[14px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    {'// php artisan up est imminent — merci de patienter'}
                </p>
            </div>
        </>
    );
}
