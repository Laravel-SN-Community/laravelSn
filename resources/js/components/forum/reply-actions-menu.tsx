import { router } from '@inertiajs/react';
import { CheckCheck, Ellipsis, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { toUrl } from '@/lib/utils';
import { destroy as replyDestroy } from '@/routes/forum/replies';
import { solution as threadSolution } from '@/routes/forum/threads';
import { revoke as solutionRevoke } from '@/routes/forum/threads/solution';
import type { Auth, ForumReply, ForumThreadFull } from '@/types';

export function ReplyActionsMenu({
    reply,
    thread,
    auth,
    isSolution,
    onEditStart,
}: {
    reply: ForumReply;
    thread: ForumThreadFull;
    auth: Auth;
    isSolution: boolean;
    onEditStart: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOwn = auth?.user?.id === reply.author.id;
    const isAdmin = auth?.role === 'admin';
    const isMod = auth?.role === 'moderator' || auth?.role === 'admin';
    const isThreadOwner = auth?.user?.id === thread.user_id;

    const canEdit = isOwn;
    const canDelete = isOwn;
    const canMark = (isThreadOwner || isMod) && !isSolution;
    const canRevoke = (isThreadOwner || isAdmin) && isSolution;
    const visible = canEdit || canDelete || canMark || canRevoke;

    useEffect(() => {
        if (!open) {
            return;
        }

        function onOutside(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        function onEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', onOutside);
        document.addEventListener('keydown', onEsc);

        return () => {
            document.removeEventListener('mousedown', onOutside);
            document.removeEventListener('keydown', onEsc);
        };
    }, [open]);

    function handleMark() {
        setOpen(false);
        router.post(
            toUrl(threadSolution({ thread: thread.slug, reply: reply.id })),
            {},
            { preserveScroll: true },
        );
    }

    function handleRevoke() {
        setOpen(false);
        router.delete(toUrl(solutionRevoke(thread.slug)), {
            preserveScroll: true,
        });
    }

    if (!visible) {
        return null;
    }

    return (
        <>
            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogContent>
                    <DialogTitle>Supprimer cette réponse ?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. La réponse sera
                        définitivement supprimée.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="sn-btn sn-btn-secondary sn-btn-sm"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => {
                                setConfirmDelete(false);
                                router.delete(toUrl(replyDestroy(reply.id)), {
                                    preserveScroll: true,
                                });
                            }}
                            className="sn-btn sn-btn-sm bg-red-600 text-white hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="grid h-7 w-7 place-items-center rounded-md transition-colors"
                    style={{
                        color: open ? 'var(--sn-fg)' : 'var(--sn-muted)',
                        background: open
                            ? 'var(--sn-surface-2)'
                            : 'transparent',
                    }}
                >
                    <Ellipsis size={15} />
                </button>

                {open && (
                    <div
                        className="absolute top-full right-0 z-50 mt-1 w-48 overflow-hidden rounded-lg py-1"
                        style={{
                            background: 'var(--sn-surface)',
                            border: '1px solid var(--sn-border)',
                            boxShadow:
                                '0 8px 24px -4px rgba(0,0,0,0.14), 0 2px 8px -2px rgba(0,0,0,0.08)',
                        }}
                    >
                        {canEdit && (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onEditStart();
                                }}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-[var(--sn-surface-2)]"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                <Pencil
                                    size={13}
                                    style={{ color: 'var(--sn-muted)' }}
                                />
                                Modifier
                            </button>
                        )}

                        {canDelete && (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setConfirmDelete(true);
                                }}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-[color-mix(in_oklch,#dc2626_8%,transparent)]"
                                style={{ color: '#dc2626' }}
                            >
                                <Trash2 size={13} />
                                Supprimer
                            </button>
                        )}

                        {(canMark || canRevoke) && (canEdit || canDelete) && (
                            <div
                                className="mx-3 my-1 h-px"
                                style={{ background: 'var(--sn-border)' }}
                            />
                        )}

                        {canMark && (
                            <button
                                onClick={handleMark}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-[var(--sn-surface-2)]"
                                style={{ color: 'var(--sn-accent)' }}
                            >
                                <CheckCheck size={13} />
                                Marquer solution
                            </button>
                        )}

                        {canRevoke && (
                            <button
                                onClick={handleRevoke}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-[color-mix(in_oklch,#dc2626_8%,transparent)]"
                                style={{ color: '#dc2626' }}
                            >
                                <X size={13} />
                                Révoquer solution
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
