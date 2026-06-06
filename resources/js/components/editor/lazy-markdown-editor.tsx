import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const MarkdownEditorImpl = lazy(() =>
    import('./markdown-editor').then((m) => ({ default: m.MarkdownEditor })),
);

type MarkdownEditorProps = ComponentProps<typeof MarkdownEditorImpl>;

export function LazyMarkdownEditor(props: MarkdownEditorProps) {
    const minHeight = props.minHeight ?? 240;

    return (
        <Suspense fallback={<EditorSkeleton minHeight={minHeight} />}>
            <MarkdownEditorImpl {...props} />
        </Suspense>
    );
}

function EditorSkeleton({ minHeight }: { minHeight: number }) {
    return (
        <div
            className={cn('sn-mdx-skeleton')}
            style={{
                border: '1px solid var(--sn-border)',
                borderRadius: 12,
                background: 'var(--sn-bg)',
                overflow: 'hidden',
            }}
            aria-busy="true"
            aria-live="polite"
        >
            <div
                className="flex items-center gap-2 px-3 py-2.5"
                style={{
                    background: 'var(--sn-surface)',
                    borderBottom: '1px solid var(--sn-border)',
                }}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <span
                        key={i}
                        className="animate-pulse rounded-md"
                        style={{
                            width: 22,
                            height: 22,
                            background: 'var(--sn-surface-2)',
                        }}
                    />
                ))}
            </div>

            <div className="px-4 py-4" style={{ minHeight }}>
                <div className="space-y-2.5">
                    <span
                        className="block animate-pulse rounded"
                        style={{
                            width: '70%',
                            height: 12,
                            background: 'var(--sn-surface-2)',
                        }}
                    />
                    <span
                        className="block animate-pulse rounded"
                        style={{
                            width: '90%',
                            height: 12,
                            background: 'var(--sn-surface-2)',
                        }}
                    />
                    <span
                        className="block animate-pulse rounded"
                        style={{
                            width: '55%',
                            height: 12,
                            background: 'var(--sn-surface-2)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
