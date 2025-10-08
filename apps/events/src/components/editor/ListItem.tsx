'use client';

import { type ReactNode } from 'react';

interface ListItemProps {
  children: ReactNode;
  className?: string;
  style?: 'normal' | 'bold' | 'italic' | 'link';
  href?: string;
}

export function ListItem({
  children,
  className = '',
  style = 'normal',
  href,
}: ListItemProps) {
  const getStyleClass = () => {
    switch (style) {
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

  const content = href ? (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={getStyleClass()}
    >
      {children}
    </a>
  ) : (
    <span className={getStyleClass()}>{children}</span>
  );

  return <li className={`${className}`}>{content}</li>;
}
