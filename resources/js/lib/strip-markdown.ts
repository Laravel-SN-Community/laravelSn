export function stripMarkdown(md: string, maxLength = 200): string {
    const text = md
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^>\s?/gm, '')
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/(\*\*|__|\*|_|~~)(.*?)\1/g, '$2')
        .replace(/^[-*_]{3,}\s*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength).trimEnd() + '…';
}
