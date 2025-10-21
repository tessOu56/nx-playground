/**
 * Table of Contents component
 * Extracts headings from HTML content and displays them as a navigable TOC
 */

import { type FC, useEffect, useState } from 'react';

import { useBlogTranslation } from '../hooks/useBlogTranslation';

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: FC<TableOfContentsProps> = ({ content }) => {
  const { t } = useBlogTranslation();
  const [headings, setHeadings] = useState<ToCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3, h4');

    const items: ToCItem[] = [];
    headingElements.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';
      const id = heading.id || `heading-${index}`;

      // Ensure the heading has an ID
      if (!heading.id) {
        heading.id = id;
      }

      items.push({ id, text, level });
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    // Track active heading on scroll
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className='space-y-2'>
      <h3 className='text-sm font-semibold text-foreground'>
        {t('toc.title')}
      </h3>
      <ul className='space-y-1 text-sm'>
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
            <a
              href={`#${id}`}
              className={`block py-1 transition-colors hover:text-primary ${
                activeId === id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};


