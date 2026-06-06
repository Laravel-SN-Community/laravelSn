import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { LazyMarkdownEditor as MarkdownEditor } from '@/components/editor/lazy-markdown-editor';
import { ReplyActionsMenu } from '@/components/forum/reply-actions-menu';
import { Markdown } from '@/components/markdown/markdown';
import { useInitials } from '@/hooks/use-initials';
import { authorTint } from '@/lib/forum';
import { toUrl } from '@/lib/utils';
import { update as replyUpdate } from '@/routes/forum/replies';
import type { Auth, ForumReply, ForumThreadFull } from '@/types';

export function ReplyCard({
    reply,
    isSolution,
    thread,
    auth,
}: {
    reply: ForumReply;
    isSolution: boolean;
    thread: ForumThreadFull;
    auth: Auth;
}) {
    const getInitials = useInitials();
    const [editing, setEditing] = useState(false);
    const [editBody, setEditBody] = useState(reply.body);

    function saveEdit() {
        if (editBody.trim() === reply.body) {
            setEditing(false);

            return;
        }

        router.patch(
            toUrl(replyUpdate(reply.id)),
            { body: editBody },
            {
                preserveScroll: true,
                onSuccess: () => setEditing(false),
            },
        );
    }

    const solutionBadge = (
        <span
            className="flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10.5px] tracking-widest uppercase"
            style={{
                background:
                    'color-mix(in oklch, var(--sn-accent) 18%, transparent)',
                color: 'var(--sn-accent)',
            }}
        >
            <Check size={10} /> solution
        </span>
    );

    const borderStyle = isSolution
        ? '1.5px solid color-mix(in oklch, var(--sn-accent) 30%, transparent)'
        : '1px solid var(--sn-border)';

    return (
        <div
            className="rounded-xl transition-all"
            style={
                isSolution
                    ? {
                          background:
                              'color-mix(in oklch, var(--sn-accent) 7%, var(--sn-surface))',
                          border: '1.5px solid color-mix(in oklch, var(--sn-accent) 45%, transparent)',
                      }
                    : {
                          background: 'var(--sn-surface)',
                          border: '1px solid var(--sn-border)',
                      }
            }
        >
            {/* Mobile header */}
            <div
                className="flex items-center gap-2.5 px-5 py-3.5 lg:hidden"
                style={{ borderBottom: borderStyle }}
            >
                <div
                    className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full"
                    style={{
                        background: reply.author.avatar
                            ? 'transparent'
                            : authorTint(reply.author.id),
                    }}
                >
                    {reply.author.avatar ? (
                        <img
                            src={reply.author.avatar}
                            alt={reply.author.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white">
                            {getInitials(reply.author.name)}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <span
                        className="block truncate text-[13px] font-semibold"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {reply.author.name}
                    </span>
                    <span
                        className="block font-mono text-[11px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {reply.created_at_human}
                        {reply.is_edited && ' · modifié'}
                    </span>
                </div>
                {isSolution && solutionBadge}
                <ReplyActionsMenu
                    reply={reply}
                    thread={thread}
                    auth={auth}
                    isSolution={isSolution}
                    onEditStart={() => setEditing(true)}
                />
            </div>

            {/* Desktop header */}
            <div
                className="hidden items-center justify-between gap-3 px-5 py-3.5 lg:flex"
                style={{ borderBottom: borderStyle }}
            >
                <div
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    <span
                        className="font-semibold"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {reply.author.name}
                    </span>
                    <span>·</span>
                    <span>
                        {reply.created_at_human}
                        {reply.is_edited && ' · modifié'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isSolution && solutionBadge}
                    <ReplyActionsMenu
                        reply={reply}
                        thread={thread}
                        auth={auth}
                        isSolution={isSolution}
                        onEditStart={() => setEditing(true)}
                    />
                </div>
            </div>

            <div className="px-5 py-4">
                {editing ? (
                    <div className="space-y-2">
                        <MarkdownEditor
                            value={editBody}
                            onChange={setEditBody}
                            scope="compact"
                            allowImages
                            minHeight={120}
                            maxHeight={360}
                            placeholder="Modifie ta réponse…"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={saveEdit}
                                className="sn-btn sn-btn-primary sn-btn-sm"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setEditBody(reply.body);
                                }}
                                className="sn-btn sn-btn-secondary sn-btn-sm"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <Markdown variant="forum">{reply.body}</Markdown>
                )}

                {reply.children.length > 0 && (
                    <div
                        className="mt-4 space-y-3 border-l-2 pl-4"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        {reply.children.map((child) => (
                            <div key={child.id}>
                                <div className="mb-1 flex items-center gap-2">
                                    <div
                                        className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full"
                                        style={{
                                            background: child.author.avatar
                                                ? 'transparent'
                                                : authorTint(child.author.id),
                                        }}
                                    >
                                        {child.author.avatar ? (
                                            <img
                                                src={child.author.avatar}
                                                alt={child.author.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-white">
                                                {getInitials(child.author.name)}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className="text-[13px] font-semibold"
                                        style={{ color: 'var(--sn-fg)' }}
                                    >
                                        {child.author.name}
                                    </span>
                                    <span
                                        className="font-mono text-[11px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        · {child.created_at_human}
                                    </span>
                                </div>
                                <Markdown variant="compact">
                                    {child.body}
                                </Markdown>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
