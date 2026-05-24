export function renderMarkdown(md: string): string {
    if (!md.trim()) {
        return '';
    }

    const blocks: string[] = [];
    const withoutCode = md.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => {
        const idx = blocks.length;
        blocks.push(
            `<pre style="background:var(--sn-surface-2);border-radius:8px;padding:14px 16px;overflow:auto;font-family:monospace;font-size:12.5px;margin:10px 0;white-space:pre;line-height:1.6">${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
        );

        return `%%CB${idx}%%`;
    });
    let out = withoutCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(
            /^## (.*)$/gm,
            '<h2 style="font-size:17px;font-weight:700;margin:16px 0 4px;color:var(--sn-fg)">$1</h2>',
        )
        .replace(
            /^# (.*)$/gm,
            '<h1 style="font-size:20px;font-weight:800;margin:16px 0 6px;color:var(--sn-fg)">$1</h1>',
        )
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(
            /`([^`\n]+?)`/g,
            '<code style="background:var(--sn-surface-2);border-radius:4px;padding:2px 6px;font-family:monospace;font-size:12.5px">$1</code>',
        )
        .replace(
            /^> (.*)$/gm,
            '<blockquote style="border-left:3px solid var(--sn-accent);padding:4px 14px;color:var(--sn-muted);margin:8px 0;font-style:italic">$1</blockquote>',
        )
        .replace(
            /^[-*] (.*)$/gm,
            '<li style="margin:3px 0;padding-left:4px">• $1</li>',
        )
        .replace(
            /^\d+\. (.*)$/gm,
            '<li style="margin:3px 0;padding-left:4px;list-style:decimal inside">$1</li>',
        );
    blocks.forEach((b, i) => {
        out = out.replace(`%%CB${i}%%`, b);
    });

    return (
        '<p style="margin:0;line-height:1.7">' +
        out
            .replace(/\n\n/g, '</p><p style="margin:10px 0;line-height:1.7">')
            .replace(/\n/g, '<br/>') +
        '</p>'
    );
}

const TINTS = [
    '#0f7b4d',
    '#b45309',
    '#0369a1',
    '#7c3aed',
    '#dc2626',
    '#188a5c',
];

export const authorTint = (id: number): string => TINTS[id % TINTS.length];

export function timeAgo(dateString: string): string {
    const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
    const diff = (new Date(dateString).getTime() - Date.now()) / 1000;
    const abs = Math.abs(diff);

    if (abs < 60) {
        return rtf.format(Math.round(diff), 'second');
    }

    if (abs < 3600) {
        return rtf.format(Math.round(diff / 60), 'minute');
    }

    if (abs < 86400) {
        return rtf.format(Math.round(diff / 3600), 'hour');
    }

    if (abs < 2592000) {
        return rtf.format(Math.round(diff / 86400), 'day');
    }

    if (abs < 31536000) {
        return rtf.format(Math.round(diff / 2592000), 'month');
    }

    return rtf.format(Math.round(diff / 31536000), 'year');
}
