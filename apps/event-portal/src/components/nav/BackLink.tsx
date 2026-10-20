import Link from 'next/link';

export function BackLink({
  href,
  label = '上一頁',
}: {
  href: string;
  label?: string;
}) {
  return (
    <div className='mb-4'>
      <Link
        href={href}
        aria-label={label}
        className='inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted'
      >
        ← {label}
      </Link>
    </div>
  );
}
