import React from 'react';

type Prop = {
  children: React.ReactNode;
  variant: 'title' | 'subtitle' | 'content' | 'note';
  className?: string;
  color?: string;
};

const variantClassMap: Record<
  'title' | 'subtitle' | 'content' | 'note',
  string
> = {
  title: 'text-2xl font-bold text-text-primary',
  subtitle: 'text-xl font-semibold text-text-primary',
  content: 'text-base text-text-primary',
  note: 'text-sm text-gray-500',
};
export const Text: React.FC<Prop> = ({
  children,
  variant = 'content',
  className = '',
  color,
}) => {
  const variantClass = variantClassMap[variant] || '';

  return (
    <span
      className={`${variantClass}   ${className} inline-block`}
      style={{ color: `${color}` }}
    >
      {children}
    </span>
  );
};
