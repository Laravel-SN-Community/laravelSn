import type { ReactElement } from 'react';

const MAX_ENTRIES = 50;

const store = new Map<string, ReactElement>();

export function getCachedRender(key: string): ReactElement | undefined {
    const hit = store.get(key);

    if (hit !== undefined) {
        store.delete(key);
        store.set(key, hit);
    }

    return hit;
}

export function setCachedRender(key: string, element: ReactElement): void {
    if (store.has(key)) {
        store.delete(key);
    } else if (store.size >= MAX_ENTRIES) {
        const oldest = store.keys().next().value;

        if (oldest !== undefined) {
            store.delete(oldest);
        }
    }

    store.set(key, element);
}

export function renderCacheKey(
    variant: string,
    headingIds: boolean,
    body: string,
): string {
    return `${variant}|${headingIds ? 1 : 0}|${body}`;
}

export function clearRenderCache(): void {
    store.clear();
}
