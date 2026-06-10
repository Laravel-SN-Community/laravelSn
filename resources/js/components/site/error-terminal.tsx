import type { CSSProperties, ReactNode } from 'react';

/**
 * Building blocks for the error & maintenance pages: a giant HTTP status
 * code whose zeros become animated rings, and a terminal window that reuses
 * the hero's chrome (traffic lights, --sn-code-* tokens).
 */

export type ZeroKind = 'search' | 'lock' | 'crash' | 'work';

function ErrorZero({ kind }: { kind: ZeroKind }) {
    return (
        <span className={`sn-err-zero sn-err-zero-${kind}`} aria-hidden>
            {kind === 'lock' && <span className="sn-err-keyhole" />}
        </span>
    );
}

export function ErrorCode({ code, kind }: { code: string; kind: ZeroKind }) {
    return (
        <div className="sn-err-code" role="img" aria-label={`Erreur ${code}`}>
            {code
                .split('')
                .map((char, i) =>
                    char === '0' ? (
                        <ErrorZero key={i} kind={kind} />
                    ) : (
                        <span key={i}>{char}</span>
                    ),
                )}
        </div>
    );
}

const TRAFFIC_LIGHTS = ['#FF5F57', '#FFBD2E', '#28C840'];

interface ErrorTerminalProps {
    file: string;
    footerLeft: string;
    footerRight: string;
    children: ReactNode;
}

export function ErrorTerminal({
    file,
    footerLeft,
    footerRight,
    children,
}: ErrorTerminalProps) {
    return (
        <div
            className="overflow-hidden rounded-xl text-left"
            style={{
                background: 'var(--sn-code-bg)',
                border: '1px solid var(--sn-code-border)',
                boxShadow: 'var(--sn-shadow-lg)',
            }}
        >
            <div
                className="flex h-10 items-center justify-between border-b px-4"
                style={{ borderColor: 'var(--sn-code-inner-border)' }}
            >
                <div className="flex items-center gap-1.5">
                    {TRAFFIC_LIGHTS.map((color) => (
                        <span
                            key={color}
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                                background: color,
                                boxShadow:
                                    '0 0 0 0.5px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.25)',
                            }}
                        />
                    ))}
                </div>
                <div
                    className="font-mono text-[11.5px]"
                    style={{ color: 'var(--sn-code-filename)' }}
                >
                    {file}
                </div>
                <div className="w-10" />
            </div>

            <div
                className="no-scrollbar overflow-x-auto p-5 font-mono text-[13px] leading-[1.85]"
                style={{ color: 'var(--sn-code-text)' }}
            >
                {children}
            </div>

            <div
                className="flex h-9 items-center justify-between border-t px-4 font-mono text-[11px]"
                style={{
                    borderColor: 'var(--sn-code-inner-border)',
                    color: 'var(--sn-code-status-text)',
                }}
            >
                <span>{footerLeft}</span>
                <span>{footerRight}</span>
            </div>
        </div>
    );
}

/** Command typed character by character, sized exactly to its content. */
export function TypedCommand({
    prompt = '$ ',
    text,
}: {
    prompt?: string;
    text: string;
}) {
    return (
        <div>
            <span style={{ color: 'var(--sn-code-comment)' }}>{prompt}</span>
            <span
                className="sn-err-typed"
                style={
                    {
                        '--w': `${text.length}ch`,
                        animationTimingFunction: `steps(${text.length})`,
                    } as CSSProperties
                }
            >
                {text}
            </span>
        </div>
    );
}

/** Output line revealed after the command finishes typing. */
export function TerminalLine({
    delay,
    color,
    className,
    children,
}: {
    delay: number;
    color?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={`sn-err-line${className ? ` ${className}` : ''}`}
            style={{ animationDelay: `${delay}s`, color }}
        >
            {children}
        </div>
    );
}

export function TerminalCaret({ color }: { color?: string }) {
    return (
        <span
            className="sn-caret"
            style={{ color: color ?? 'var(--sn-code-caret)' }}
        >
            ▍
        </span>
    );
}
