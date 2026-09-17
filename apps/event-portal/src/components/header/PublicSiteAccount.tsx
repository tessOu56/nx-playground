'use client';

import { demoCopy } from '@/libs/i18n/demo-copy';
import { useLiff } from '@/libs';

export function PublicSiteAccount({ locale }: { locale: string }) {
  const { isLoggedIn, profile, logout } = useLiff();
  const copy = demoCopy(locale);

  if (!isLoggedIn) {
    return null;
  }

  const name = profile?.displayName?.trim() || '';

  return (
    <div className='flex items-center gap-3 text-sm'>
      {name ? (
        <span className='max-w-[9rem] truncate text-gray-700'>{name}</span>
      ) : null}
      <button
        type='button'
        onClick={() => logout()}
        className='text-gray-700 hover:text-gray-900'
      >
        {copy.logout}
      </button>
    </div>
  );
}
