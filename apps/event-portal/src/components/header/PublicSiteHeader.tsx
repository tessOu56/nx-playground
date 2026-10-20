'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LocaleSwitcher } from './LocaleSwitcher';
import { PublicSiteAccount } from './PublicSiteAccount';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { demoCopy } from '@/libs/i18n/demo-copy';

function navClass(active: boolean) {
  return [
    'rounded-md px-1.5 py-1 text-xs font-medium sm:px-2 sm:text-sm',
    active
      ? 'bg-gray-100 text-gray-900'
      : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ');
}

export function PublicSiteHeader({ locale }: { locale: string }) {
  const pathname = usePathname() || `/${locale}`;
  const home = `/${locale}`;
  const events = `/${locale}/events`;
  const copy = demoCopy(locale);
  const onEvents = pathname === events || pathname.startsWith(`${events}/`);

  return (
    <header className='sticky top-0 z-40 border-b border-gray-200 bg-[color:var(--color-base-white,#fff)]/95 backdrop-blur'>
      <div className='mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2 sm:min-h-16 sm:px-4'>
        <Link
          href={home}
          className='min-w-0 truncate font-display text-sm font-semibold tracking-tight text-gray-900 sm:text-lg'
        >
          {copy.siteName}
        </Link>
        <nav
          className='flex min-w-0 flex-wrap items-center gap-0.5 text-sm sm:gap-2'
          aria-label={copy.mainNav}
        >
          <Link
            href={events}
            className={navClass(onEvents)}
            aria-current={onEvents ? 'page' : undefined}
          >
            {copy.navEvents}
          </Link>
          <LineOfficialCta locale={locale} variant='nav' />
          <LocaleSwitcher locale={locale} />
          <PublicSiteAccount locale={locale} />
        </nav>
      </div>
    </header>
  );
}
