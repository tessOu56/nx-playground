'use client';

import { canStartLineLogin, useLiff } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function PublicSiteAccount({ locale }: { locale: string }) {
  const { isLoggedIn, profile, logout, login, isInitialized, error } = useLiff();
  const copy = demoCopy(locale);
  const lineLoginReady = canStartLineLogin();

  if (isLoggedIn) {
    const name = profile?.displayName?.trim() ?? '';
    return (
      <div className='flex items-center gap-2 text-sm'>
        {name ? (
          <span className='max-w-[9rem] truncate text-gray-700'>{name}</span>
        ) : null}
        <button
          type='button'
          onClick={() => logout()}
          className='rounded-md px-1.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 hover:text-gray-900 sm:px-2 sm:text-sm'
        >
          {copy.logout}
        </button>
      </div>
    );
  }

  if (!lineLoginReady) {
    return null;
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onClick={() => login()}
        disabled={!isInitialized}
        className='rounded-md px-1.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 hover:text-gray-900 sm:px-2 sm:text-sm'
      >
        {error
          ? copy.retryLogin
          : isInitialized
            ? copy.lineLogin
            : copy.linePreparing}
      </button>
      {error ? (
        <span className='sr-only' role='alert'>
          {copy.lineLoginError}
        </span>
      ) : null}
    </div>
  );
}
