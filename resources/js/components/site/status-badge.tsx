const STATUS_STYLE: Record<
    string,
    { label: string; bg: string; color: string; dot: string }
> = {
    pending: {
        label: 'En attente',
        bg: 'rgba(245,158,11,0.1)',
        color: '#b45309',
        dot: '#f59e0b',
    },
    approved: {
        label: 'Approuvé',
        bg: 'color-mix(in oklch, var(--sn-accent) 10%, transparent)',
        color: 'var(--sn-700)',
        dot: 'var(--sn-accent)',
    },
    published: {
        label: 'Publié',
        bg: 'color-mix(in oklch, var(--sn-600) 12%, transparent)',
        color: 'var(--sn-700)',
        dot: 'var(--sn-600)',
    },
    draft: {
        label: 'Brouillon',
        bg: 'var(--sn-surface-2)',
        color: 'var(--sn-muted)',
        dot: 'var(--sn-border)',
    },
    declined: {
        label: 'Refusé',
        bg: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
        color: 'var(--destructive)',
        dot: 'var(--destructive)',
    },
};

export function StatusBadge({ status }: { status: string }) {
    const s = STATUS_STYLE[status] ?? {
        label: status,
        bg: 'var(--sn-surface-2)',
        color: 'var(--sn-muted)',
        dot: 'var(--sn-border)',
    };

    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ background: s.bg, color: s.color }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: s.dot }}
            />
            {s.label}
        </span>
    );
}
