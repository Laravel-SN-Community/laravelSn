import { Link, useForm } from '@inertiajs/react';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import { Lock } from 'lucide-react';
import React, { useRef } from 'react';
import { LazyMarkdownEditor as MarkdownEditor } from '@/components/editor/lazy-markdown-editor';
import { toUrl } from '@/lib/utils';
import { store as repliesStore } from '@/routes/forum/replies';
import { lock as threadLock } from '@/routes/forum/threads';
import type { Auth, ForumThreadFull } from '@/types';

export function ReplyForm({
    thread,
    auth,
}: {
    thread: ForumThreadFull;
    auth: Auth;
}) {
    const editorRef = useRef<MDXEditorMethods>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });
    const isMod = auth?.role === 'admin' || auth?.role === 'moderator';

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(toUrl(repliesStore(thread.slug)), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                editorRef.current?.setMarkdown('');
            },
        });
    }

    return (
        <form
            onSubmit={submit}
            className="rounded-xl p-5"
            style={{
                background: 'var(--sn-surface)',
                border: '1px solid var(--sn-border)',
            }}
        >
            <div
                className="mb-3 font-mono text-[11px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--sn-muted)' }}
            >
                Ta réponse
            </div>
            <MarkdownEditor
                ref={editorRef}
                value={data.body}
                onChange={(v) => setData('body', v)}
                error={errors.body}
                scope="compact"
                allowImages
                minHeight={140}
                maxHeight={360}
                placeholder="Ta réponse en markdown…"
                disabled={processing}
            />
            <div className="mt-3 flex items-center justify-end">
                <div className="flex items-center gap-2">
                    {isMod && (
                        <Link
                            href={toUrl(threadLock(thread.slug))}
                            method="post"
                            as="button"
                            preserveScroll
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                        >
                            <Lock size={12} className="mr-1.5" />
                            Fermer
                        </Link>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="sn-btn sn-btn-primary sn-btn-sm"
                    >
                        {processing ? 'Envoi…' : 'Publier la réponse'}
                    </button>
                </div>
            </div>
        </form>
    );
}
