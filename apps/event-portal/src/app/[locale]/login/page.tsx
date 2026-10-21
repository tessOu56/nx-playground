'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';

import {
  identityAuthErrorText,
  resolveAuthError,
} from '@/libs/auth/auth-errors';
import { authClient } from '@/libs/auth/auth-client';
import { LINE_TW_PROVIDER_ID } from '@/libs/auth/line-account-map';
import { safeAuthReturnTo } from '@/libs/auth/return-to';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { canStartLineLogin } from '@/libs/line/constants';

function authErrorCopy(copy: ReturnType<typeof demoCopy>) {
  return {
    alreadyLinkedToOtherUser: copy.alreadyLinkedToOtherUser,
    lastSignInMethod: copy.lastSignInMethod,
    accountNotLinked: copy.accountNotLinked,
    sessionNotFresh: copy.sessionNotFresh,
    fallback: copy.lineLoginError,
  };
}

function LoginButtons() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const copy = demoCopy(locale);
  const [error, setError] = useState<string | null>(
    identityAuthErrorText(authErrorCopy(copy), {
      error: searchParams.get('error'),
      code: searchParams.get('error_code') ?? searchParams.get('code'),
      message:
        searchParams.get('error_description') ?? searchParams.get('message'),
    })
  );
  const lineReady = canStartLineLogin();

  const callbackURL = () => {
    if (typeof window === 'undefined') return '/zh-TW/events';
    return safeAuthReturnTo(
      searchParams.get('return_to'),
      window.location.origin
    );
  };

  useEffect(() => {
    if (
      typeof PublicKeyCredential === 'undefined' ||
      typeof PublicKeyCredential.isConditionalMediationAvailable !== 'function'
    ) {
      return;
    }
    let cancelled = false;
    void PublicKeyCredential.isConditionalMediationAvailable().then(
      available => {
        if (!available || cancelled) return;
        void authClient.signIn.passkey({ autoFill: true }).then(result => {
          if (cancelled || result.error || !result.data) return;
          window.location.assign(callbackURL());
        });
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (provider: 'google' | typeof LINE_TW_PROVIDER_ID) => {
    setError(null);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: callbackURL(),
        errorCallbackURL: `${window.location.origin}/${locale}/login`,
      });
      if (result.error) {
        setError(
          resolveAuthError(authErrorCopy(copy), {
            code: result.error.code,
            message: result.error.message,
          })
        );
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.lineLoginError);
    }
  };

  const signInPasskey = async () => {
    setError(null);
    try {
      const result = await authClient.signIn.passkey();
      if (result.error) {
        setError(result.error.message || copy.lineLoginError);
        return;
      }
      if (result.data) {
        window.location.assign(callbackURL());
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.lineLoginError);
    }
  };

  return (
    <div className='mx-auto max-w-md px-4 py-16'>
      <h1 className='font-display text-2xl font-semibold text-foreground'>
        {copy.signIn}
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
          {copy.googleLogin}
        </button>
        <button
          type='button'
          onClick={() => void signInPasskey()}
          className='inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted'
        >
          {copy.passkeyLogin}
        </button>
        <label
          className='mt-2 block text-sm text-muted-foreground'
          htmlFor='passkey-username'
        >
          {copy.passkeyUsername}
        </label>
        <input
          id='passkey-username'
          type='text'
          name='username'
          autoComplete='username webauthn'
          className='rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
        />
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
