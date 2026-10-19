'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LocaleSwitcher } from './LocaleSwitcher';
import { PublicSiteAccount } from './PublicSiteAccount';

import { demoCopy } from '@/libs/i18n/demo-copy';

function navClass(active: boolean) {
  return [
    'rounded-md px-2 py-1 text-sm font-medium',
    active
      ? 'bg-gray-100 text-gray-900'
      : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ');
}

export function PublicSiteHeader({ locale }: { locale: string }) {
  const pathname = usePathname() || `/${locale}`;
  const home = `/${locale}`;
  const events = `/${locale}/events`;
  const orders = `/${locale}/orders`;
  const copy = demoCopy(locale);
  const onEvents = pathname === events || pathname.startsWith(`${events}/`);
  const onOrders = pathname === orders || pathname.startsWith(`${orders}/`);

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4'>
          <Link
            href={home}
            className='truncate text-base font-semibold text-gray-900 sm:text-lg'
          >
            {copy.siteName}
          </Link>
          <nav
            className='flex shrink-0 items-center gap-1 text-sm sm:gap-2'
            aria-label={copy.mainNav}
          >
            <Link
              href={events}
              className={navClass(onEvents)}
              aria-current={onEvents ? 'page' : undefined}
            >
              {copy.navEvents}
            </Link>
            <Link
              href={orders}
              className={navClass(onOrders)}
              aria-current={onOrders ? 'page' : undefined}
            >
              {copy.navOrders}
            </Link>
            <LocaleSwitcher locale={locale} />
            <PublicSiteAccount locale={locale} />
          </nav>
        </div>
      </header>
      <div className='h-16' aria-hidden />
    </>
  );
}
