import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    icon,
    iconBg,
    title,
    description,
    extra,
    confirmLabel,
    confirmLabelLoading,
    loading = false,
    confirmStyle,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: React.ReactNode;
    extra?: React.ReactNode;
    confirmLabel: string;
    confirmLabelLoading?: string | undefined;
    loading?: boolean;
    confirmStyle: React.CSSProperties;
}) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(o) => !o && !loading && onClose()}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className="fixed top-1/2 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                    style={{
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                    }}
                    onPointerDownOutside={(e) => {
                        if (loading) {
                            e.preventDefault();
                        }
                    }}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: iconBg }}
                        >
                            {icon}
                        </div>
                        <Dialog.Close
                            disabled={loading}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-40"
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
                            <X size={14} />
                        </Dialog.Close>
                    </div>
                    <Dialog.Title
                        className="mt-4 text-[17px] font-semibold tracking-tight"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        {title}
                    </Dialog.Title>
                    <Dialog.Description
                        className="mt-1.5 text-[13.5px] leading-relaxed"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        {description}
                    </Dialog.Description>
                    {extra}
                    <div className="mt-6 flex justify-end gap-3">
                        <Dialog.Close
                            disabled={loading}
                            className="sn-btn sn-btn-secondary sn-btn-sm disabled:opacity-50"
                        >
                            Annuler
                        </Dialog.Close>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="sn-btn sn-btn-sm rounded-lg px-4 py-2 text-[13px] font-semibold transition-opacity focus:outline-none disabled:opacity-60"
                            style={confirmStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.88';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            {loading && confirmLabelLoading
                                ? confirmLabelLoading
                                : confirmLabel}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
