'use client';

interface Heading1Props {
  children: React.ReactNode;
  className?: string;
}

export function Heading1({ children, className = '' }: Heading1Props) {
  return (
    <h1
      className={`text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0 ${className}`}
    >
      {children}
    </h1>
  );
}
