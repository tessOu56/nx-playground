'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { catalogHref } from '@/libs/api/catalog-query';
import { DEFAULT_LOCALE } from '@/libs/constants';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function AppErrorFallback({
  locale,
  onRetry,
}: {
  locale?: string;
  onRetry?: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const resolved =
    locale ??
    (typeof params?.locale === 'string' ? params.locale : DEFAULT_LOCALE);
  const copy = demoCopy(resolved);
  const retry =
    onRetry ??
    (() => {
      if (typeof window !== 'undefined') window.location.reload();
    });

  return (
    <div className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4'>
      <div className='mx-auto w-full max-w-md text-center'>
        <h1 className='font-display text-2xl font-semibold tracking-tight text-gray-900'>
          {copy.appError}
        </h1>
        <p className='mt-3 text-sm leading-6 text-gray-600'>{copy.appErrorHint}</p>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <button
            type='button'
            onClick={retry}
            className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
          >
            {copy.reloadPage}
          </button>
          <Link
            href={catalogHref(resolved)}
            className='inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          >
            {copy.backToEvents}
          </Link>
          <LineOfficialCta locale={resolved} />
        </div>
      </div>
    </div>
  );
}
