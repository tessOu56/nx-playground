'use client';

import Link from 'next/link';

import { useLiff } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function PublicSiteAccount({ locale }: { locale: string }) {
  const { isLoggedIn, profile, logout } = useLiff();
  const copy = demoCopy(locale);
  const accountHref = `/${locale}/account`;
  const loginHref = `/${locale}/login`;

  if (isLoggedIn) {
    const name = profile?.displayName?.trim() ?? '';
    return (
      <div className='flex items-center gap-2 text-sm'>
        {name ? (
          <span className='max-w-[9rem] truncate text-foreground'>{name}</span>
        ) : null}
        <Link
          href={accountHref}
          className='rounded-md px-1.5 py-1 text-xs font-medium text-foreground hover:bg-muted sm:px-2 sm:text-sm'
        >
          {copy.navAccount}
        </Link>
        <button
          type='button'
          onClick={() => logout()}
          className='rounded-md px-1.5 py-1 text-xs font-medium text-foreground hover:bg-muted sm:px-2 sm:text-sm'
        >
          {copy.logout}
        </button>
      </div>
    );
  }

  return (
    <Link
      href={loginHref}
      className='rounded-md px-1.5 py-1 text-xs font-medium text-foreground hover:bg-muted sm:px-2 sm:text-sm'
    >
      {copy.signIn}
    </Link>
  );
}
