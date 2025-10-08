'use client';

interface IconLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function IconLink({ href, children, className = '' }: IconLinkProps) {
  return (
    <div className={`my-4 ${className}`}>
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
      >
        <span className='mr-2' role='img' aria-label='連結'>
          🔗
        </span>
        {children}
      </a>
    </div>
  );
}
