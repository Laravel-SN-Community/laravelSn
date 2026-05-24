import { Link, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import React from 'react';
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
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });
    const isMod = auth?.role === 'admin' || auth?.role === 'moderator';

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(toUrl(repliesStore(thread.slug)), {
            preserveScroll: true,
            onSuccess: () => reset(),
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
            <textarea
                rows={4}
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                placeholder="Tape ta réponse en markdown…"
                className="w-full resize-none rounded-md px-3 py-2.5 text-[14px]"
                style={{
                    background: 'var(--sn-bg)',
                    border: `1px solid ${errors.body ? 'var(--sn-error, #dc2626)' : 'var(--sn-border)'}`,
                    color: 'var(--sn-fg)',
                }}
            />
            {errors.body && (
                <p
                    className="mt-1 text-[12px]"
                    style={{ color: 'var(--sn-error, #dc2626)' }}
                >
                    {errors.body}
                </p>
            )}
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
