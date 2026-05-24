export type ForumAuthor = {
    id: number;
    name: string;
    username: string;
    roles?: Array<{ name: string }>;
};

export type ForumChannelMin = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
};

export type ForumChannel = ForumChannelMin & {
    description: string | null;
    icon: string | null;
    threads_count: number;
    total_replies: number;
    is_active: boolean;
    children: ForumChannel[];
};

export type ForumThreadSummary = {
    id: number;
    user_id: number;
    slug: string;
    title: string;
    body: string;
    is_locked: boolean;
    is_pinned: boolean;
    solution_reply_id: number | null;
    replies_count: number;
    views_count: number;
    last_posted_at: string;
    created_at: string;
    author: ForumAuthor;
    channels: ForumChannelMin[];
};

export type ForumReply = {
    id: number;
    body: string;
    is_edited: boolean;
    edited_at: string | null;
    created_at: string;
    author: ForumAuthor;
    children: ForumReply[];
};

export type ForumThreadFull = ForumThreadSummary & {
    solution: { id: number; author: ForumAuthor } | null;
    resolved_at: string | null;
    likes_count: number;
    user_liked: boolean;
};

export type PaginatedThreads = {
    data: ForumThreadSummary[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

export type PaginatedReplies = {
    data: ForumReply[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};
