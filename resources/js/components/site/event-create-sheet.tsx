import { router } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CalendarDays, Check, ChevronDown, Minus, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import EventController from '@/actions/App/Http/Controllers/EventController';
import { CoverImageUpload } from '@/components/site/cover-image-upload';

type Venue = { id: number; name: string; district: string };

type AgendaItem = { _id: string; time: string; title: string };

export type EditableEvent = {
    slug: string;
    title: string;
    format: string;
    description: string;
    starts_at: string;
    ends_at: string | null;
    registration_opens_at: string | null;
    registration_closes_at: string | null;
    is_online: boolean;
    online_url: string | null;
    venue_id: number | null;
    capacity: number | null;
    waitlist_capacity: number;
    agenda: Array<{ time: string; title: string }> | null;
    is_featured: boolean;
    is_sponsored: boolean;
    replay_url: string | null;
    cover_url: string | null;
    status: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venues: Venue[];
    event?: EditableEvent;
};

const FORMATS = [
    { value: 'meetup', label: 'Meetup' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conférence' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'webinar', label: 'Webinaire' },
];

const EMPTY_FORM = {
    title: '',
    format: 'meetup',
    description: '',
    starts_at: '',
    ends_at: '',
    registration_opens_at: '',
    registration_closes_at: '',
    is_online: false,
    venue_id: '' as string,
    online_url: '',
    capacity: '',
    waitlist_capacity: '',
    agenda: [] as AgendaItem[],
    is_featured: false,
    is_sponsored: false,
    replay_url: '',
};

function uid() {
    return Math.random().toString(36).slice(2);
}

function toDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) {
        return '';
    }

    return iso.slice(0, 16);
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="mb-1.5 text-[12.5px] font-medium"
            style={{ color: 'var(--sn-fg)' }}
        >
            {children}
        </div>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <p
            className="mt-1 text-[11.5px]"
            style={{ color: 'var(--destructive)' }}
        >
            {message}
        </p>
    );
}

function SectionHead({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <div
                    className="text-[17px] font-semibold tracking-tight"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    {title}
                </div>
                <div
                    className="mt-0.5 text-[13px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    {subtitle}
                </div>
            </div>
            {action}
        </div>
    );
}

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none"
            style={{
                background: checked ? 'var(--sn-600)' : 'var(--sn-surface-2)',
                border: '1px solid var(--sn-border)',
            }}
        >
            <span
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                style={{ left: checked ? '18px' : '2px' }}
            />
        </button>
    );
}

function Divider() {
    return <hr style={{ borderColor: 'var(--sn-border)' }} />;
}

function SheetSelect({
    value,
    onValueChange,
    disabled,
    placeholder,
    style,
    children,
}: {
    value: string;
    onValueChange: (v: string) => void;
    disabled?: boolean;
    placeholder?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}) {
    return (
        <SelectPrimitive.Root
            {...(value ? { value } : {})}
            onValueChange={onValueChange}
            {...(disabled ? { disabled: true } : {})}
        >
            <SelectPrimitive.Trigger
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13.5px] transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                    background: 'var(--sn-surface-2)',
                    border: '1px solid var(--sn-border)',
                    color: value ? 'var(--sn-fg)' : 'var(--sn-muted)',
                    ...style,
                }}
            >
                <SelectPrimitive.Value placeholder={placeholder ?? '—'} />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown
                        size={14}
                        style={{ color: 'var(--sn-muted)', flexShrink: 0 }}
                    />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={4}
                    className="z-[200] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl shadow-xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                    style={{
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                    }}
                >
                    <SelectPrimitive.Viewport className="p-1">
                        {children}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}

function SheetSelectItem({
    value,
    children,
}: {
    value: string;
    children: React.ReactNode;
}) {
    return (
        <SelectPrimitive.Item
            value={value}
            className="relative flex cursor-pointer items-center rounded-lg px-3 py-2 text-[13.5px] transition-colors outline-none select-none data-[highlighted]:bg-[color:var(--sn-surface-2)] data-[state=checked]:font-medium"
            style={{ color: 'var(--sn-fg)' }}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="ml-auto pl-3">
                <Check size={13} style={{ color: 'var(--sn-600)' }} />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
}

function SheetDatetime({
    value,
    onChange,
    disabled,
    style,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div
            className="relative cursor-pointer"
            onClick={() =>
                !disabled &&
                (
                    ref.current as HTMLInputElement & {
                        showPicker?: () => void;
                    }
                )?.showPicker?.()
            }
        >
            <CalendarDays
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                style={{ color: 'var(--sn-muted)' }}
            />
            <input
                ref={ref}
                type="datetime-local"
                className="w-full cursor-pointer appearance-none rounded-lg px-3 py-2 pl-9 text-[13.5px] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
                style={{
                    background: 'var(--sn-surface-2)',
                    border: '1px solid var(--sn-border)',
                    color: value ? 'var(--sn-fg)' : 'var(--sn-muted)',
                    opacity: disabled ? 0.5 : 1,
                    ...style,
                }}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
}

export default function EventCreateSheet({
    open,
    onOpenChange,
    venues,
    event,
}: Props) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverRemovedFromServer, setCoverRemovedFromServer] = useState(false);

    const isEditing = event !== undefined;

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (event) {
            setForm({
                title: event.title,
                format: event.format,
                description: event.description,
                starts_at: toDatetimeLocal(event.starts_at),
                ends_at: toDatetimeLocal(event.ends_at),
                registration_opens_at: toDatetimeLocal(
                    event.registration_opens_at,
                ),
                registration_closes_at: toDatetimeLocal(
                    event.registration_closes_at,
                ),
                is_online: event.is_online,
                venue_id: event.venue_id ? String(event.venue_id) : '',
                online_url: event.online_url ?? '',
                capacity: event.capacity ? String(event.capacity) : '',
                waitlist_capacity: event.waitlist_capacity
                    ? String(event.waitlist_capacity)
                    : '',
                agenda: (event.agenda ?? []).map((a) => ({ _id: uid(), ...a })),
                is_featured: event.is_featured,
                is_sponsored: event.is_sponsored,
                replay_url: event.replay_url ?? '',
            });
        } else {
            setForm(EMPTY_FORM);
        }

        setCoverFile(null);
        setCoverRemovedFromServer(false);
    }, [event?.slug, open]); // eslint-disable-line react-hooks/exhaustive-deps
    /* eslint-enable react-hooks/set-state-in-effect */

    function set<K extends keyof typeof EMPTY_FORM>(
        key: K,
        value: (typeof EMPTY_FORM)[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function addAgendaItem() {
        set('agenda', [...form.agenda, { _id: uid(), time: '', title: '' }]);
    }

    function updateAgendaItem(
        id: string,
        field: 'time' | 'title',
        value: string,
    ) {
        set(
            'agenda',
            form.agenda.map((item) =>
                item._id === id ? { ...item, [field]: value } : item,
            ),
        );
    }

    function removeAgendaItem(id: string) {
        set(
            'agenda',
            form.agenda.filter((item) => item._id !== id),
        );
    }

    function handleClose() {
        setForm(EMPTY_FORM);
        setErrors({});
        setCoverFile(null);
        setCoverRemovedFromServer(false);
        onOpenChange(false);
    }

    function buildPayload(publish: boolean) {
        return {
            title: form.title,
            format: form.format,
            description: form.description,
            starts_at: form.starts_at || null,
            ends_at: form.ends_at || null,
            registration_opens_at: form.registration_opens_at || null,
            registration_closes_at: form.registration_closes_at || null,
            is_online: form.is_online,
            venue_id: form.is_online
                ? null
                : form.venue_id
                  ? parseInt(form.venue_id)
                  : null,
            online_url: form.online_url || null,
            capacity: form.capacity ? parseInt(form.capacity) : null,
            waitlist_capacity: form.waitlist_capacity
                ? parseInt(form.waitlist_capacity)
                : 0,
            agenda: form.agenda.map(({ time, title }) => ({ time, title })),
            is_featured: form.is_featured,
            is_sponsored: form.is_sponsored,
            replay_url: form.replay_url || null,
            publish,
        };
    }

    function submit(publish: boolean) {
        setSubmitting(true);
        setErrors({});

        const hasCoverChange =
            coverFile !== null || (coverRemovedFromServer && !coverFile);
        const payload = {
            ...buildPayload(publish),
            ...(hasCoverChange && {
                cover: coverFile,
                cover_remove: coverRemovedFromServer && !coverFile,
            }),
        };
        const options = {
            forceFormData: hasCoverChange,
            onSuccess: () => handleClose(),
            onFinish: () => setSubmitting(false),
            onError: (errs: Record<string, string>) => setErrors(errs),
        };

        if (isEditing && event) {
            router.patch(
                EventController.update.url({ event: event.slug }),
                payload,
                options,
            );
        } else {
            router.post(EventController.store.url(), payload, options);
        }
    }

    const isPublished = event?.status === 'published';
    const isPast =
        isEditing && event ? new Date(event.starts_at) < new Date() : false;
    const locked = isPast;

    const inputCls =
        'w-full rounded-lg px-3 py-2 text-[13.5px] outline-none transition-colors focus:ring-1';
    const inputStyle = {
        background: 'var(--sn-surface-2)',
        border: '1px solid var(--sn-border)',
        color: 'var(--sn-fg)',
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    handleClose();
                }
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className="fixed inset-2 z-50 flex flex-col rounded-2xl shadow-2xl transition ease-in-out outline-none data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:slide-in-from-right sm:top-4 sm:right-4 sm:bottom-4 sm:left-auto sm:w-[760px] sm:max-w-[calc(100vw-32px)]"
                    style={{
                        background: 'var(--sn-bg)',
                        border: '1px solid var(--sn-border)',
                    }}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    {/* Header */}
                    <div
                        className="flex shrink-0 items-start justify-between border-b px-6 pt-5 pb-4"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        <div>
                            <div
                                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                {isEditing ? 'Modifier' : 'Nouvel évènement'}
                            </div>
                            <Dialog.Title
                                className="mt-1 text-[20px] font-semibold tracking-tight"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                {isEditing ? event.title : 'Créer un évènement'}
                            </Dialog.Title>
                        </div>
                        <button
                            onClick={handleClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[color:var(--sn-surface-2)]"
                            style={{ color: 'var(--sn-muted)' }}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
                        {/* Past-event notice */}
                        {locked && (
                            <div
                                className="rounded-xl px-4 py-3 text-[13px] leading-relaxed"
                                style={{
                                    background:
                                        'color-mix(in oklch, #f59e0b 10%, transparent)',
                                    border: '1px solid color-mix(in oklch, #f59e0b 30%, transparent)',
                                    color: '#92400e',
                                }}
                            >
                                Cet évènement est terminé. Seul le champ{' '}
                                <strong>URL replay</strong> peut encore être
                                modifié.
                            </div>
                        )}

                        {/* Informations */}
                        <section className="space-y-4">
                            <SectionHead
                                title="Informations"
                                subtitle="L'essentiel : nom, format, description."
                            />

                            <div>
                                <Label>Titre</Label>
                                <input
                                    type="text"
                                    className={inputCls}
                                    style={{
                                        ...inputStyle,
                                        opacity: locked ? 0.5 : 1,
                                    }}
                                    placeholder="Meetup Dakar #10 — Eloquent avancé"
                                    value={form.title}
                                    readOnly={locked}
                                    onChange={(e) =>
                                        !locked && set('title', e.target.value)
                                    }
                                />
                                <FieldError message={errors.title} />
                            </div>

                            <div>
                                <Label>Format</Label>
                                <SheetSelect
                                    value={form.format}
                                    disabled={locked}
                                    style={{ opacity: locked ? 0.5 : 1 }}
                                    onValueChange={(v) => set('format', v)}
                                >
                                    {FORMATS.map((f) => (
                                        <SheetSelectItem
                                            key={f.value}
                                            value={f.value}
                                        >
                                            {f.label}
                                        </SheetSelectItem>
                                    ))}
                                </SheetSelect>
                                <FieldError message={errors.format} />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <textarea
                                    className={inputCls}
                                    style={{
                                        ...inputStyle,
                                        height: '100px',
                                        resize: locked ? 'none' : 'vertical',
                                        opacity: locked ? 0.5 : 1,
                                    }}
                                    placeholder="Présente l'évènement en quelques phrases : pourquoi y venir, à qui s'adresse-t-il, ce qu'on y verra."
                                    value={form.description}
                                    readOnly={locked}
                                    onChange={(e) =>
                                        !locked &&
                                        set('description', e.target.value)
                                    }
                                />
                                <FieldError message={errors.description} />
                            </div>

                            {!locked && (
                                <CoverImageUpload
                                    value={coverFile}
                                    existingUrl={
                                        coverRemovedFromServer
                                            ? null
                                            : (event?.cover_url ?? null)
                                    }
                                    onChange={(file) => {
                                        setCoverFile(file);

                                        if (file) {
                                            setCoverRemovedFromServer(false);
                                        }
                                    }}
                                    onRemoveExisting={() => {
                                        setCoverFile(null);
                                        setCoverRemovedFromServer(true);
                                    }}
                                    error={errors.cover}
                                />
                            )}
                        </section>

                        <Divider />

                        {/* Quand */}
                        <section className="space-y-4">
                            <SectionHead
                                title="Quand"
                                subtitle="Date de l'évènement et fenêtre d'inscription."
                            />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <Label>Début</Label>
                                    <SheetDatetime
                                        value={form.starts_at}
                                        disabled={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set('starts_at', e.target.value)
                                        }
                                    />
                                    <FieldError message={errors.starts_at} />
                                </div>
                                <div>
                                    <Label>Fin</Label>
                                    <SheetDatetime
                                        value={form.ends_at}
                                        disabled={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set('ends_at', e.target.value)
                                        }
                                    />
                                    <FieldError message={errors.ends_at} />
                                </div>
                                <div>
                                    <Label>Ouverture des inscriptions</Label>
                                    <SheetDatetime
                                        value={form.registration_opens_at}
                                        disabled={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set(
                                                'registration_opens_at',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        message={errors.registration_opens_at}
                                    />
                                </div>
                                <div>
                                    <Label>Clôture des inscriptions</Label>
                                    <SheetDatetime
                                        value={form.registration_closes_at}
                                        disabled={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set(
                                                'registration_closes_at',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        message={errors.registration_closes_at}
                                    />
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* Où */}
                        <section className="space-y-4">
                            <SectionHead
                                title="Où"
                                subtitle="Adresse physique ou lien de connexion."
                            />

                            <div
                                className="inline-flex rounded-lg p-0.5 font-mono text-[12px]"
                                style={{
                                    background: 'var(--sn-surface-2)',
                                    border: '1px solid var(--sn-border)',
                                }}
                            >
                                {(['Sur place', 'En ligne'] as const).map(
                                    (opt) => {
                                        const isOnline = opt === 'En ligne';
                                        const active =
                                            form.is_online === isOnline;

                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() =>
                                                    !locked &&
                                                    set('is_online', isOnline)
                                                }
                                                disabled={locked}
                                                className="rounded-md px-4 py-1.5 transition-colors disabled:cursor-not-allowed"
                                                style={{
                                                    background: active
                                                        ? 'var(--sn-bg)'
                                                        : 'transparent',
                                                    color: active
                                                        ? 'var(--sn-fg)'
                                                        : 'var(--sn-muted)',
                                                    boxShadow: active
                                                        ? '0 1px 3px rgba(0,0,0,0.1)'
                                                        : 'none',
                                                    opacity: locked ? 0.5 : 1,
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    },
                                )}
                            </div>

                            {form.is_online ? (
                                <div>
                                    <Label>URL de connexion</Label>
                                    <input
                                        type="url"
                                        className={inputCls}
                                        style={{
                                            ...inputStyle,
                                            opacity: locked ? 0.5 : 1,
                                        }}
                                        placeholder="https://meet.google.com/..."
                                        value={form.online_url}
                                        readOnly={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set('online_url', e.target.value)
                                        }
                                    />
                                    <FieldError message={errors.online_url} />
                                </div>
                            ) : (
                                <div>
                                    <Label>Lieu</Label>
                                    <SheetSelect
                                        value={form.venue_id}
                                        disabled={locked}
                                        placeholder="— Sélectionner un lieu —"
                                        style={{ opacity: locked ? 0.5 : 1 }}
                                        onValueChange={(v) =>
                                            set('venue_id', v)
                                        }
                                    >
                                        {venues.map((v) => (
                                            <SheetSelectItem
                                                key={v.id}
                                                value={String(v.id)}
                                            >
                                                {v.name} · {v.district}
                                            </SheetSelectItem>
                                        ))}
                                    </SheetSelect>
                                    <FieldError message={errors.venue_id} />
                                </div>
                            )}
                        </section>

                        <Divider />

                        {/* Capacité */}
                        <section className="space-y-4">
                            <SectionHead
                                title="Capacité"
                                subtitle="Combien de personnes peuvent s'inscrire."
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Places disponibles</Label>
                                    <input
                                        type="number"
                                        min="1"
                                        className={inputCls}
                                        style={{
                                            ...inputStyle,
                                            opacity: locked ? 0.5 : 1,
                                        }}
                                        placeholder="50"
                                        value={form.capacity}
                                        readOnly={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set('capacity', e.target.value)
                                        }
                                    />
                                    <FieldError message={errors.capacity} />
                                </div>
                                <div>
                                    <Label>Liste d'attente</Label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={inputCls}
                                        style={{
                                            ...inputStyle,
                                            opacity: locked ? 0.5 : 1,
                                        }}
                                        placeholder="0"
                                        value={form.waitlist_capacity}
                                        readOnly={locked}
                                        onChange={(e) =>
                                            !locked &&
                                            set(
                                                'waitlist_capacity',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        message={errors.waitlist_capacity}
                                    />
                                    <div
                                        className="mt-1 text-[11px]"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        Inscriptions au-delà de la capacité
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* Programme */}
                        <section className="space-y-4">
                            <SectionHead
                                title="Programme"
                                subtitle="Les temps forts de l'évènement (optionnel)."
                                action={
                                    !locked ? (
                                        <button
                                            type="button"
                                            onClick={addAgendaItem}
                                            className="flex items-center gap-1 font-mono text-[12px] transition-opacity hover:opacity-70"
                                            style={{ color: 'var(--sn-600)' }}
                                        >
                                            <Plus size={13} />
                                            Ajouter
                                        </button>
                                    ) : undefined
                                }
                            />

                            {form.agenda.length === 0 ? (
                                <button
                                    type="button"
                                    onClick={() => !locked && addAgendaItem()}
                                    disabled={locked}
                                    className="w-full rounded-lg py-6 text-center font-mono text-[12px] transition-colors hover:bg-[color:var(--sn-surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{
                                        border: '1px dashed var(--sn-border)',
                                        color: 'var(--sn-muted)',
                                    }}
                                >
                                    + Ajouter une première ligne au programme
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    {form.agenda.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="text"
                                                className={inputCls}
                                                style={{
                                                    ...inputStyle,
                                                    width: '80px',
                                                    flexShrink: 0,
                                                    opacity: locked ? 0.5 : 1,
                                                }}
                                                placeholder="18:00"
                                                value={item.time}
                                                readOnly={locked}
                                                onChange={(e) =>
                                                    !locked &&
                                                    updateAgendaItem(
                                                        item._id,
                                                        'time',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                type="text"
                                                className={`${inputCls} flex-1`}
                                                style={{
                                                    ...inputStyle,
                                                    opacity: locked ? 0.5 : 1,
                                                }}
                                                placeholder="Titre de la session"
                                                value={item.title}
                                                readOnly={locked}
                                                onChange={(e) =>
                                                    !locked &&
                                                    updateAgendaItem(
                                                        item._id,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {!locked && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAgendaItem(
                                                            item._id,
                                                        )
                                                    }
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] hover:text-[color:var(--destructive)]"
                                                    style={{
                                                        color: 'var(--sn-muted)',
                                                    }}
                                                >
                                                    <Minus size={13} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <Divider />

                        {/* Mise en avant */}
                        <section className="space-y-4">
                            <SectionHead
                                title="Mise en avant"
                                subtitle="Visibilité et contenu lié."
                            />

                            <div className="space-y-3">
                                <div
                                    className="flex items-start gap-3"
                                    style={{ opacity: locked ? 0.5 : 1 }}
                                >
                                    <Toggle
                                        checked={form.is_featured}
                                        onChange={(v) =>
                                            !locked && set('is_featured', v)
                                        }
                                    />
                                    <div>
                                        <div
                                            className="text-[13.5px] font-medium"
                                            style={{ color: 'var(--sn-fg)' }}
                                        >
                                            À la une
                                        </div>
                                        <div
                                            className="text-[12px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            Affiche cet évènement en tête de la
                                            liste publique
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex items-start gap-3"
                                    style={{ opacity: locked ? 0.5 : 1 }}
                                >
                                    <Toggle
                                        checked={form.is_sponsored}
                                        onChange={(v) =>
                                            !locked && set('is_sponsored', v)
                                        }
                                    />
                                    <div>
                                        <div
                                            className="text-[13.5px] font-medium"
                                            style={{ color: 'var(--sn-fg)' }}
                                        >
                                            Sponsorisé
                                        </div>
                                        <div
                                            className="text-[12px]"
                                            style={{ color: 'var(--sn-muted)' }}
                                        >
                                            Marque l'évènement comme partenaire
                                            / sponsorisé
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>URL replay</Label>
                                <input
                                    type="url"
                                    className={inputCls}
                                    style={inputStyle}
                                    placeholder="https://youtube.com/..."
                                    value={form.replay_url}
                                    onChange={(e) =>
                                        set('replay_url', e.target.value)
                                    }
                                />
                                <FieldError message={errors.replay_url} />
                                <div
                                    className="mt-1 text-[11px]"
                                    style={{ color: 'var(--sn-muted)' }}
                                >
                                    À renseigner après l'évènement.
                                </div>
                            </div>
                        </section>

                        <div className="h-2" />
                    </div>

                    {/* Footer */}
                    <div
                        className="flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4"
                        style={{ borderColor: 'var(--sn-border)' }}
                    >
                        <button
                            type="button"
                            onClick={handleClose}
                            className="sn-btn sn-btn-ghost sn-btn-sm"
                            disabled={submitting}
                        >
                            Annuler
                        </button>
                        {!locked && !isPublished && (
                            <button
                                type="button"
                                onClick={() => submit(false)}
                                className="sn-btn sn-btn-secondary sn-btn-sm"
                                disabled={submitting}
                            >
                                {isEditing
                                    ? 'Enregistrer'
                                    : 'Enregistrer en brouillon'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => submit(true)}
                            className="sn-btn sn-btn-primary sn-btn-sm"
                            disabled={submitting}
                        >
                            {locked
                                ? 'Enregistrer le replay'
                                : isEditing && isPublished
                                  ? 'Mettre à jour'
                                  : 'Publier'}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
