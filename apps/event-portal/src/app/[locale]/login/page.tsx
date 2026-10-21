'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Suspense, useState } from 'react';

import { authClient } from '@/libs/auth/auth-client';
import { LINE_TW_PROVIDER_ID } from '@/libs/auth/line-account-map';
import { safeAuthReturnTo } from '@/libs/auth/return-to';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { canStartLineLogin } from '@/libs/line/constants';

function LoginButtons() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const copy = demoCopy(locale);
  const [error, setError] = useState<string | null>(null);
  const lineReady = canStartLineLogin();

  const callbackURL = () => {
    if (typeof window === 'undefined') return '/zh-TW/events';
    return safeAuthReturnTo(
      searchParams.get('return_to'),
      window.location.origin
    );
  };

  const signIn = async (provider: 'google' | typeof LINE_TW_PROVIDER_ID) => {
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: callbackURL(),
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.lineLoginError);
    }
  };

  return (
    <div className='mx-auto max-w-md px-4 py-16'>
      <h1 className='font-display text-2xl font-semibold text-foreground'>
        Sign in
      </h1>
      <p className='mt-2 text-sm text-muted-foreground'>{copy.homeLead}</p>
      <div className='mt-8 flex flex-col gap-3'>
        {lineReady ? (
          <button
            type='button'
            onClick={() => signIn(LINE_TW_PROVIDER_ID)}
            className='inline-flex items-center justify-center rounded-md bg-[#06C755] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90'
          >
            {copy.lineLogin}
          </button>
        ) : null}
        <button
          type='button'
          onClick={() => signIn('google')}
          className='inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted'
        >
          Google
        </button>
      </div>
      {error ? (
        <p className='mt-4 text-sm text-red-800' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginButtons />
    </Suspense>
  );
}
