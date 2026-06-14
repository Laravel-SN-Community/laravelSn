import { router } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Inertia restores pages from its history cache on browser Back/Forward without
 * hitting the server, so mutations made elsewhere (e.g. pinning a thread) leave
 * the restored page stale. This module-level flag records when the current page
 * was reached through a history navigation so the hook below can revalidate.
 */
let reachedViaHistory = false;

if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
        reachedViaHistory = true;
    });
}

/**
 * Refetches the given props when the page is restored through a browser
 * Back/Forward navigation, keeping merged props (infinite scroll) fresh.
 *
 * @param props Prop keys to reload and reset.
 */
export function useReloadOnHistoryNavigation(props: string[]): void {
    useEffect(() => {
        if (reachedViaHistory) {
            router.reload({ only: props, reset: props });
        }

        reachedViaHistory = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
