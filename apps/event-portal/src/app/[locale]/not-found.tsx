'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

import { demoCopy } from '@/libs/i18n/demo-copy';

export default function LocaleNotFound() {
  const locale = useLocale();
  const copy = demoCopy(locale);

  return (
    <div className='flex min-h-[70vh] items-center justify-center bg-gray-50 px-4'>
      <div className='mx-auto w-full max-w-md text-center'>
        <p className='text-sm font-medium text-gray-500'>404</p>
        <h1 className='mt-2 text-3xl font-semibold tracking-tight text-gray-900'>
          {copy.pageNotFound}
        </h1>
        <p className='mt-3 text-sm leading-6 text-gray-600'>
          {copy.pageNotFoundHint}
        </p>
        <div className='mt-8'>
          <Link
            href={`/${locale}/events`}
            className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
          >
            {copy.backToEvents}
          </Link>
        </div>
      </div>
    </div>
  );
}
