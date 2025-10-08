'use client';

import { parseMarkdownStyle } from './utils';

interface OrderedListProps {
  children: React.ReactNode;
  className?: string;
}

export function OrderedList({ children, className = '' }: OrderedListProps) {
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

  return (
    <ol
      className={`text-gray-700 mb-4 list-decimal list-inside space-y-1 ${className}`}
    >
      <li>{content}</li>
    </ol>
  );
}
