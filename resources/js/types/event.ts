export type EventVenue = {
    id: number;
    name: string;
    district: string | null;
};

export type EventSpeaker = {
    id: number;
    name: string;
    role: string | null;
    company: string | null;
    bio: string | null;
    avatar_url: string;
    twitter_handle: string | null;
    linkedin_handle: string | null;
    talk_title: string | null;
    talk_description: string | null;
    order: number;
};

export type EventSummary = {
    id: number;
    title: string;
    slug: string;
    format: string;
    description: string;
    starts_at: string;
    ends_at: string | null;
    capacity: number | null;
    waitlist_capacity: number;
    is_featured: boolean;
    is_online: boolean;
    is_sponsored: boolean;
    cover_path: string | null;
    confirmed_count: number;
    venue: EventVenue | null;
    speakers: EventSpeaker[];
};

export type EventFull = EventSummary & {
    agenda: string | null;
    online_url: string | null;
    replay_url: string | null;
    registration_opens_at: string | null;
    registration_closes_at: string | null;
    registrations_open: boolean;
    available_seats: number | null;
    is_full: boolean;
};

export type EventRegistration = {
    id: number;
    status: string;
    status_label: string;
    registered_at: string;
    confirmed_at: string | null;
    cancelled_at: string | null;
};

export type PaginatedEvents = {
    data: EventSummary[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

const MONTHS_FR = [
    'jan',
    'fév',
    'mar',
    'avr',
    'mai',
    'juin',
    'juil',
    'août',
    'sep',
    'oct',
    'nov',
    'déc',
] as const;

export function formatEventDate(isoString: string): {
    day: string;
    month: string;
    year: string;
    time: string;
} {
    const d = new Date(isoString);

    return {
        day: String(d.getDate()).padStart(2, '0'),
        month: MONTHS_FR[d.getMonth()],
        year: String(d.getFullYear()),
        time: d.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        }),
    };
}
