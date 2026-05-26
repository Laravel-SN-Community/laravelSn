import { ImageIcon, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

type Props = {
    value: File | null;
    existingUrl?: string | null;
    onChange: (file: File | null) => void;
    onRemoveExisting?: () => void;
    error?: string | undefined;
};

export function CoverImageUpload({
    value,
    existingUrl,
    onChange,
    onRemoveExisting,
    error,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [sizeError, setSizeError] = useState<string | null>(null);

    const objectUrl = useMemo(
        () => (value ? URL.createObjectURL(value) : null),
        [value],
    );

    useEffect(() => {
        if (!objectUrl) {
            return;
        }

        return () => URL.revokeObjectURL(objectUrl);
    }, [objectUrl]);

    const previewSrc = objectUrl ?? existingUrl ?? null;
    const showingNewFile = objectUrl !== null;

    function handleFiles(files: FileList | null) {
        const file = files?.[0];

        if (!file || !file.type.startsWith('image/')) {
            return;
        }

        if (file.size > MAX_SIZE_BYTES) {
            setSizeError("L'image ne doit pas dépasser 2 Mo.");

            return;
        }

        setSizeError(null);
        onChange(file);
    }

    function handleRemove() {
        setSizeError(null);

        if (showingNewFile) {
            onChange(null);
        } else {
            onRemoveExisting?.();
        }
    }

    const displayError = sizeError ?? error ?? null;

    if (previewSrc) {
        return (
            <div>
                <div
                    className="mb-1.5 text-[12.5px] font-medium"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    Image de couverture
                </div>
                <div
                    className="group relative overflow-hidden rounded-xl"
                    style={{ aspectRatio: '16/7' }}
                >
                    <img
                        src={previewSrc}
                        alt="Couverture"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-[12px] font-medium text-gray-900 backdrop-blur-sm transition-transform hover:scale-105"
                        >
                            <X size={13} />
                            Supprimer
                        </button>
                    </div>
                </div>
                {displayError && (
                    <p
                        className="mt-1 text-[12px]"
                        style={{ color: 'var(--destructive)' }}
                    >
                        {displayError}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div>
            <div
                className="mb-1.5 text-[12.5px] font-medium"
                style={{ color: 'var(--sn-fg)' }}
            >
                Image de couverture
            </div>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                className="flex w-full flex-col items-center gap-3 rounded-xl px-4 py-9 text-center transition-all"
                style={{
                    background: dragging
                        ? 'color-mix(in oklch, var(--sn-accent) 8%, var(--sn-surface))'
                        : 'var(--sn-surface)',
                    border: `1.5px dashed ${dragging ? 'var(--sn-accent)' : 'var(--sn-border)'}`,
                }}
            >
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: 'var(--sn-surface-2)' }}
                >
                    <ImageIcon
                        size={18}
                        style={{
                            color: dragging
                                ? 'var(--sn-accent)'
                                : 'var(--sn-muted)',
                        }}
                    />
                </div>
                <div>
                    <span
                        className="text-[13px] font-medium"
                        style={{ color: 'var(--sn-fg)' }}
                    >
                        Déposez votre fichier{' '}
                    </span>
                    <span
                        className="text-[13px]"
                        style={{ color: 'var(--sn-muted)' }}
                    >
                        ou{' '}
                    </span>
                    <span
                        className="text-[13px] font-medium"
                        style={{ color: 'var(--sn-accent)' }}
                    >
                        cliquez pour parcourir
                    </span>
                </div>
                <p
                    className="text-[11.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    JPG, PNG, WebP, AVIF · max 2 Mo
                </p>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
            {displayError && (
                <p
                    className="mt-1 text-[12px]"
                    style={{ color: 'var(--destructive)' }}
                >
                    {displayError}
                </p>
            )}
        </div>
    );
}
