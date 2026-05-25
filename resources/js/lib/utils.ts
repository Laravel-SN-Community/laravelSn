import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function tagTint(slug: string): string {
    const palette = ['var(--sn-500)', 'var(--sn-600)', 'var(--sn-700)'];
    let h = 0;

    for (const c of slug) {
        h = (h * 31 + c.charCodeAt(0)) >>> 0;
    }

    return palette[h % palette.length];
}
