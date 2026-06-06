const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
];

function csrfToken(): string {
    const meta = document.head.querySelector<HTMLMetaElement>(
        'meta[name="csrf-token"]',
    );

    return meta?.content ?? '';
}

export async function uploadEditorImage(file: File): Promise<string> {
    if (!ACCEPTED.includes(file.type)) {
        throw new Error(
            'Format non supporté. Utilise JPG, PNG, WebP, AVIF ou GIF.',
        );
    }

    if (file.size > MAX_BYTES) {
        throw new Error('Image trop lourde (5 Mo maximum).');
    }

    const body = new FormData();
    body.append('image', file);

    let response: Response;

    try {
        response = await fetch('/editor/images', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
            body,
            credentials: 'same-origin',
        });
    } catch {
        throw new Error("Échec réseau pendant l'envoi de l'image.");
    }

    if (response.status === 413) {
        throw new Error('Image trop lourde (5 Mo maximum).');
    }

    if (response.status === 422) {
        const payload = (await response.json().catch(() => null)) as {
            message?: string;
        } | null;

        throw new Error(payload?.message ?? 'Image refusée par le serveur.');
    }

    if (response.status === 401 || response.status === 419) {
        throw new Error('Session expirée. Recharge la page et reconnecte-toi.');
    }

    if (!response.ok) {
        throw new Error("Le serveur a refusé l'image. Réessaie.");
    }

    const payload = (await response.json().catch(() => null)) as {
        url?: string;
    } | null;

    if (!payload?.url) {
        throw new Error('Réponse invalide du serveur.');
    }

    return payload.url;
}
