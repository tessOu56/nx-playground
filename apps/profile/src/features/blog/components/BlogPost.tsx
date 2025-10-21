/**
 * Blog post content component
 * Renders HTML content with proper styling
 */

import { type FC, useEffect, useRef } from 'react';

interface BlogPostProps {
  content: string;
}

export const BlogPost: FC<BlogPostProps> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Add IDs to headings for TOC linking
    const headings = contentRef.current.querySelectorAll('h2, h3, h4');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        const id =
          text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim() || `heading-${index}`;
        heading.id = id;
      }
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className='prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-foreground
        prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
        prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2
        prose-p:text-muted-foreground prose-p:leading-7
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-muted prose-pre:border prose-pre:border-border
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
        prose-ul:text-muted-foreground prose-ol:text-muted-foreground
        prose-li:marker:text-primary
        prose-table:text-foreground
        prose-th:bg-muted prose-th:text-foreground
        prose-td:border-border
        prose-img:rounded-lg prose-img:shadow-md'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};


