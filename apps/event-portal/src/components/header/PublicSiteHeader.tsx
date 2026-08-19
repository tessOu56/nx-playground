import Link from 'next/link';

export function PublicSiteHeader({ locale }: { locale: string }) {
  const home = `/${locale}`;
  const events = `/${locale}/events`;

  return (
    <header className='border-b border-gray-200 bg-white'>
      <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
        <Link href={home} className='text-lg font-semibold text-gray-900'>
          NX Playground Events
        </Link>
        <nav className='flex gap-4 text-sm'>
          <Link href={events} className='text-gray-700 hover:text-gray-900'>
            活動
          </Link>
          <Link href={`${home}/orders`} className='text-gray-700 hover:text-gray-900'>
            訂單
          </Link>
        </nav>
      </div>
    </header>
  );
}
