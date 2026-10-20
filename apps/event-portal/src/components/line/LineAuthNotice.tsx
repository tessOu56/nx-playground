'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { LineOfficialCta } from './LineOfficialCta';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { canStartLineLogin, useLiff } from '@/libs/line';
import {
  lineAuthNoticeParams,
  parseLineAuthNotice,
} from '@/libs/line/line-auth-notice';

function isLineUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Line\//i.test(navigator.userAgent);
}

export function LineAuthNotice({ locale }: { locale: string }) {
  const copy = demoCopy(locale);
  const router = useRouter();
  const pathname = usePathname() || `/${locale}`;
  const searchParams = useSearchParams();
  const { login, isInitialized } = useLiff();
  const [dismissed, setDismissed] = useState(false);
  const lineLoginReady = canStartLineLogin();

  const kind = useMemo(
    () =>
      parseLineAuthNotice(searchParams, {
        isInClient: isLineUserAgent(),
      }),
    [searchParams]
  );

  if (!kind || dismissed) return null;

  const title =
    kind === 'cancelled'
      ? copy.lineLoginCancelled
      : kind === 'outside'
        ? copy.lineOutside
        : copy.lineLoginError;
  const hint =
    kind === 'cancelled'
      ? copy.lineLoginCancelledHint
      : kind === 'outside'
        ? copy.lineOutsideHint
        : copy.loadErrorHint;

  const dismiss = () => {
    setDismissed(true);
    const next = new URLSearchParams(searchParams.toString());
    for (const key of lineAuthNoticeParams()) {
      next.delete(key);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const retryLogin = () => {
    dismiss();
    login();
  };

  return (
    <div
      className='border-b border-amber-200 bg-amber-50'
      role='alert'
      data-testid={`line-auth-notice-${kind}`}
    >
      <div className='mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold text-amber-950'>{title}</p>
          <p className='mt-0.5 text-sm leading-6 text-amber-900'>{hint}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {kind !== 'cancelled' ? <LineOfficialCta locale={locale} /> : null}
          {kind !== 'outside' && lineLoginReady ? (
            <button
              type='button'
              onClick={retryLogin}
              disabled={!isInitialized}
              className='rounded-md px-3 py-2 text-sm font-medium text-amber-950 underline-offset-2 hover:underline disabled:opacity-60'
            >
              {copy.retryLogin}
            </button>
          ) : null}
          <button
            type='button'
            onClick={dismiss}
            className='rounded-md px-3 py-2 text-sm font-medium text-amber-950 underline-offset-2 hover:underline'
          >
            {copy.dismissNotice}
          </button>
        </div>
      </div>
    </div>
  );
}
