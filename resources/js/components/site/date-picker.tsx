import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type DateCell = { day: number; type: 'prev' | 'curr' | 'next' };

function DatePicker({
    value,
    onChange,
    min,
    disabled,
    label,
    hint,
}: {
    value: string;
    onChange: (v: string) => void;
    min?: string;
    disabled?: boolean;
    label?: string | undefined;
    hint?: string | undefined;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = min ? new Date(min + 'T00:00:00') : today;
    const selected = value ? new Date(value + 'T00:00:00') : null;

    const [view, setView] = useState(() => {
        const base = selected ?? today;

        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    useEffect(() => {
        function onOut(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', onOut);
        }

        return () => document.removeEventListener('mousedown', onOut);
    }, [open]);

    const monthLabel = view.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
    });
    const firstDayMon =
        (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
    const daysInMonth = new Date(
        view.getFullYear(),
        view.getMonth() + 1,
        0,
    ).getDate();
    const daysInPrevMonth = new Date(
        view.getFullYear(),
        view.getMonth(),
        0,
    ).getDate();

    const cells: DateCell[] = [];

    for (let i = firstDayMon - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, type: 'prev' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, type: 'curr' });
    }

    let next = 1;

    while (cells.length % 7 !== 0) {
        cells.push({ day: next++, type: 'next' });
    }

    function cellDate(cell: DateCell): Date {
        let m = view.getMonth(),
            y = view.getFullYear();

        if (cell.type === 'prev') {
            m--;

            if (m < 0) {
                m = 11;
                y--;
            }
        }

        if (cell.type === 'next') {
            m++;

            if (m > 11) {
                m = 0;
                y++;
            }
        }

        return new Date(y, m, cell.day);
    }

    function pick(cell: DateCell) {
        const d = cellDate(cell);

        if (d < minDate) {
            return;
        }

        onChange(d.toISOString().split('T')[0]);
        setOpen(false);

        if (cell.type !== 'curr') {
            setView(new Date(d.getFullYear(), d.getMonth(), 1));
        }
    }

    function isSel(cell: DateCell) {
        if (!selected) {
            return false;
        }

        const d = cellDate(cell);

        return d.toDateString() === selected.toDateString();
    }
    function isDis(cell: DateCell) {
        return cellDate(cell) < minDate;
    }
    function isTod(cell: DateCell) {
        return cellDate(cell).toDateString() === today.toDateString();
    }

    const displayValue = selected
        ? selected.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;

    return (
        <div
            style={{
                opacity: disabled ? 0.4 : 1,
                transition: 'opacity 200ms',
                pointerEvents: disabled ? 'none' : 'auto',
            }}
        >
            <div
                className="mb-1.5 text-[12px] font-medium"
                style={{ color: 'var(--sn-fg)' }}
            >
                {label ?? 'Date de publication'}
            </div>
            <div ref={ref} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none"
                    style={{
                        background: 'var(--sn-surface)',
                        border: `1px solid ${open ? 'var(--sn-accent)' : 'var(--sn-border)'}`,
                        color: displayValue
                            ? 'var(--sn-fg)'
                            : 'var(--sn-muted)',
                    }}
                >
                    <Calendar
                        size={14}
                        style={{ color: 'var(--sn-muted)', flexShrink: 0 }}
                    />
                    <span className="flex-1 text-[13.5px]">
                        {displayValue ?? 'Sélectionner une date'}
                    </span>
                    <ChevronDown
                        size={13}
                        style={{
                            color: 'var(--sn-muted)',
                            flexShrink: 0,
                            transform: open ? 'rotate(180deg)' : 'none',
                            transition: 'transform 180ms',
                        }}
                    />
                </button>
                {open && (
                    <div
                        className="absolute top-full right-0 left-0 z-30 mt-1 rounded-xl p-4 shadow-xl"
                        style={{
                            background: 'var(--sn-bg)',
                            border: '1px solid var(--sn-border)',
                        }}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <span
                                className="text-[13px] font-semibold capitalize"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {monthLabel}
                            </span>
                            <div className="flex items-center gap-0.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setView(
                                            new Date(
                                                view.getFullYear(),
                                                view.getMonth() - 1,
                                                1,
                                            ),
                                        )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                                    style={{ color: 'var(--sn-muted)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            'var(--sn-surface-2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            'transparent';
                                    }}
                                >
                                    <ChevronLeft size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setView(
                                            new Date(
                                                view.getFullYear(),
                                                view.getMonth() + 1,
                                                1,
                                            ),
                                        )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                                    style={{ color: 'var(--sn-muted)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            'var(--sn-surface-2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            'transparent';
                                    }}
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-7">
                            {['lu', 'ma', 'me', 'je', 've', 'sa', 'di'].map(
                                (d) => (
                                    <div
                                        key={d}
                                        className="flex h-8 items-center justify-center text-[11.5px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        {d}
                                    </div>
                                ),
                            )}
                        </div>
                        <div className="grid grid-cols-7">
                            {cells.map((cell, i) => {
                                const sel = isSel(cell);
                                const dis = isDis(cell);
                                const tod = isTod(cell);
                                const overflow = cell.type !== 'curr';

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center py-0.5"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => pick(cell)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors"
                                            style={{
                                                background: sel
                                                    ? 'var(--sn-accent)'
                                                    : 'transparent',
                                                color: sel
                                                    ? 'var(--sn-accent-fg)'
                                                    : dis
                                                      ? 'var(--sn-border)'
                                                      : overflow
                                                        ? 'color-mix(in oklch, var(--sn-muted) 50%, transparent)'
                                                        : 'var(--sn-fg)',
                                                cursor: dis
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!dis && !sel) {
                                                    e.currentTarget.style.background =
                                                        'var(--sn-surface-2)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!sel) {
                                                    e.currentTarget.style.background =
                                                        'transparent';
                                                }
                                            }}
                                        >
                                            {cell.day}
                                        </button>
                                        {tod && !sel && (
                                            <span
                                                className="h-1 w-1 rounded-full"
                                                style={{
                                                    background:
                                                        'var(--sn-accent)',
                                                    marginTop: '-2px',
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <p
                className="mt-1 text-[11px]"
                style={{ color: 'var(--sn-muted)' }}
            >
                {hint ?? 'Indicatif — fixée par les modérateurs.'}
            </p>
        </div>
    );
}

export { DatePicker };
