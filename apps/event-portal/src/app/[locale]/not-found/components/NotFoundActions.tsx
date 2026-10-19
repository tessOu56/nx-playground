'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import { demoCopy, useLocalizedRouter } from '@/libs/i18n';

export function NotFoundActions() {
  const router = useLocalizedRouter();
  const locale = useLocale();
  const copy = demoCopy(locale);

  return (
    <div className='flex flex-col justify-center gap-3 sm:flex-row'>
      <Link
        href={`/${locale}/events`}
        className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
      >
        {copy.backToEvents}
      </Link>
      <button
        type='button'
        onClick={() => router.back()}
        className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50'
      >
        {copy.goBack}
      </button>
    </div>
  );
}
