'use client';

import { parseMarkdownStyle } from './utils';

interface QuoteProps {
  children: React.ReactNode;
  className?: string;
}

export function Quote({ children, className = '' }: QuoteProps) {
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
    <blockquote
      className={`border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg ${className}`}
    >
      <p className='text-gray-700 italic'>{content}</p>
    </blockquote>
  );
}
