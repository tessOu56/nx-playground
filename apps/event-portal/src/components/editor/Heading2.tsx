'use client';

import { parseMarkdownStyle } from './utils';

interface Heading2Props {
  children: React.ReactNode;
  className?: string;
}

export function Heading2({ children, className = '' }: Heading2Props) {
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
    <h2 className={`text-2xl font-bold text-gray-900 mt-6 mb-3 ${className}`}>
      {content}
    </h2>
  );
}
