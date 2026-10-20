'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { catalogHref } from '@/libs/api/catalog-query';
import { canStartLineLogin, useLiff } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function HeroSection() {
  const locale = useLocale();
  const copy = demoCopy(locale);
  const { isInitialized, login, error, isLoggedIn, profile } = useLiff();
  const lineLoginReady = canStartLineLogin();
  const displayName = profile?.displayName?.trim() ?? '';

  return (
    <section className='relative overflow-hidden border-b border-gray-200 bg-white'>
      <div className='mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8'>
        <div className='max-w-2xl'>
          <p className='text-xs font-medium uppercase tracking-[0.18em] text-gray-500'>
            {copy.homeBadge}
          </p>
          <h1 className='mt-4 font-display text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
            {isLoggedIn ? copy.welcomeBack(displayName) : copy.homeTitle}
          </h1>
          <p className='mt-5 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8'>
            {copy.homeLead}
          </p>
          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <Link
              href={catalogHref(locale)}
              className='inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
            >
              {copy.browse}
            </Link>
            <Link
              href={catalogHref(locale, { city: 'TAIPEI' })}
              className='inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            >
              {copy.seeCity('TAIPEI')}
            </Link>
            <Link
              href={catalogHref(locale, { city: 'TOKYO' })}
              className='inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            >
              {copy.seeCity('TOKYO')}
            </Link>
            {!isLoggedIn && lineLoginReady ? (
              <button
                type='button'
                onClick={() => login()}
                disabled={!isInitialized}
                className='inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-60'
              >
                {isInitialized ? copy.lineLogin : copy.linePreparing}
              </button>
            ) : null}
            <LineOfficialCta locale={locale} />
          </div>
          {error ? (
            <p className='mt-4 text-sm text-red-800' role='alert'>
              {copy.lineLoginError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
