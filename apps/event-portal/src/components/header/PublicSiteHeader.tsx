import Link from 'next/link';

import { PublicSiteAccount } from './PublicSiteAccount';

export function PublicSiteHeader({ locale }: { locale: string }) {
  const home = `/${locale}`;
  const events = `/${locale}/events`;
  const isEn = locale === 'en';

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-4'>
          <Link href={home} className='text-lg font-semibold text-gray-900'>
            NX Playground Events
          </Link>
          <nav className='flex items-center gap-4 text-sm'>
            <Link href={events} className='text-gray-700 hover:text-gray-900'>
              {isEn ? 'Events' : '活動'}
            </Link>
            <Link
              href={`${home}/orders`}
              className='text-gray-700 hover:text-gray-900'
            >
              {isEn ? 'Orders' : '訂單'}
            </Link>
            <PublicSiteAccount locale={locale} />
          </nav>
        </div>
      </header>
      <div className='h-16' aria-hidden />
    </>
  );
}

