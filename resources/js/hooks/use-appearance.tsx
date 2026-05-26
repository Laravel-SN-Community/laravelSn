import { router } from '@inertiajs/react';
import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance =
    typeof window !== 'undefined'
        ? (localStorage.getItem('appearance') as Appearance) || 'system'
        : 'system';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    return (localStorage.getItem('appearance') as Appearance) || 'system';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => applyTheme(currentAppearance);

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('appearance')) {
        localStorage.setItem('appearance', 'system');
        setCookie('appearance', 'system');
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);

    mediaQuery()?.addEventListener('change', handleSystemThemeChange);

    router.on('navigate', (event) => {
        const appearance = (
            event.detail.page.props as { auth?: { appearance?: string | null } }
        )?.auth?.appearance as Appearance | undefined;
        if (appearance && appearance !== currentAppearance) {
            currentAppearance = appearance;
            localStorage.setItem('appearance', appearance);
            setCookie('appearance', appearance);
            applyTheme(appearance);
            notify();
        }
    });
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'system',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        localStorage.setItem('appearance', mode);
        setCookie('appearance', mode);
        applyTheme(mode);
        notify();

        // Persist to DB for logged-in users (fire-and-forget)
        try {
            const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
            if (xsrf) {
                fetch('/dashboard/settings/appearance', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrf),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ appearance: mode }),
                }).catch(() => {});
            }
        } catch {
            // Guest or fetch unavailable — localStorage is the fallback
        }
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
