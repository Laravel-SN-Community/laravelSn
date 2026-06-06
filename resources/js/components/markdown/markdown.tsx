import { memo, useMemo } from 'react';
import type { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { codeLanguageAliases, codeLanguages } from '@/lib/code-languages';
import {
    getCachedRender,
    renderCacheKey,
    setCachedRender,
} from '@/lib/markdown-cache';
import { slugify } from '@/lib/slugify';
import { cn } from '@/lib/utils';

import './markdown.css';

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [
    [
        rehypeHighlight,
        {
            languages: codeLanguages,
            aliases: codeLanguageAliases,
            detect: false,
            plainText: ['txt', 'text'],
        },
    ],
] as const;

export type MarkdownVariant = 'article' | 'forum' | 'compact';

export interface MarkdownProps {
    children: string;
    variant?: MarkdownVariant;
    headingIds?: boolean;
    className?: string;
}

function MarkdownInner({
    children,
    variant = 'forum',
    headingIds = false,
    className,
}: MarkdownProps) {
    const components = useMemo<Components>(
        () => ({
            a({ href, children, ...props }) {
                const isExternal = !!href && /^https?:\/\//i.test(href);

                return (
                    <a
                        href={href}
                        {...(isExternal
                            ? {
                                  target: '_blank',
                                  rel: 'noopener noreferrer nofollow ugc',
                              }
                            : {})}
                        {...props}
                    >
                        {children}
                    </a>
                );
            },
            h2({ children, ...props }) {
                const id = headingIds ? slugify(textOf(children)) : undefined;

                return (
                    <h2 id={id} {...props}>
                        {children}
                    </h2>
                );
            },
            h3({ children, ...props }) {
                const id = headingIds ? slugify(textOf(children)) : undefined;

                return (
                    <h3 id={id} {...props}>
                        {children}
                    </h3>
                );
            },
            img({ src, alt, ...props }) {
                return (
                    <img
                        src={src}
                        alt={alt ?? ''}
                        loading="lazy"
                        decoding="async"
                        {...props}
                    />
                );
            },
            pre({ children, ...props }) {
                return (
                    <div className="sn-code">
                        <pre {...props}>{children}</pre>
                    </div>
                );
            },
        }),
        [headingIds],
    );

    const rendered = useMemo<ReactElement>(() => {
        const key = renderCacheKey(variant, headingIds, children);
        const cached = getCachedRender(key);

        if (cached) {
            return cached;
        }

        const element = (
            <ReactMarkdown
                remarkPlugins={REMARK_PLUGINS}
                rehypePlugins={REHYPE_PLUGINS as never}
                components={components}
            >
                {children}
            </ReactMarkdown>
        );

        setCachedRender(key, element);

        return element;
    }, [children, variant, headingIds, components]);

    return (
        <div className={cn('sn-md', `sn-md--${variant}`, className)}>
            {rendered}
        </div>
    );
}

export const Markdown = memo(MarkdownInner);

function textOf(children: React.ReactNode): string {
    if (typeof children === 'string') {
        return children;
    }

    if (Array.isArray(children)) {
        return children.map(textOf).join('');
    }

    if (
        children &&
        typeof children === 'object' &&
        'props' in children &&
        children.props
    ) {
        return textOf(
            (children.props as { children?: React.ReactNode }).children,
        );
    }

    return '';
}
