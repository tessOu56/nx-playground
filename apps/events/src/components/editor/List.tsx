'use client';

import { type ReactNode } from 'react';

import { parseMarkdownStyle } from './utils';

interface ListProps {
  children: ReactNode;
  className?: string;
  isOrdered?: boolean;
}

export function List({
  children,
  className = '',
  isOrdered = false,
}: ListProps) {
  const text = children as string;
  const styleInfo = parseMarkdownStyle(text);

  const getStyleClass = () => {
    switch (styleInfo.style) {
      case 'bold':
        return 'font-bold';
      case 'italic':
        return 'italic';
      case 'link':
        return 'text-blue-600 hover:text-blue-800 hover:underline transition-colors';
      default:
        return '';
    }
  };

  const content = styleInfo.href ? (
    <a
      href={styleInfo.href}
      target='_blank'
      rel='noopener noreferrer'
      className={getStyleClass()}
    >
      {styleInfo.content}
    </a>
  ) : (
    <span className={getStyleClass()}>{styleInfo.content}</span>
  );

  const ListTag = isOrdered ? 'ol' : 'ul';
  const listClass = isOrdered
    ? 'list-decimal list-inside'
    : 'list-disc list-inside';

  return (
    <ListTag
      className={`text-gray-700 mb-4 ${listClass} space-y-1 ${className}`}
    >
      <li>{content}</li>
    </ListTag>
  );
}
