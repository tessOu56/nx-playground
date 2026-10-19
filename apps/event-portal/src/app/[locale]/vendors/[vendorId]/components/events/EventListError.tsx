'use client';

import { demoCopy } from '@/libs/i18n/demo-copy';

interface EventListErrorProps {
  onRetry?: () => void;
  locale?: string;
}

/** Shown when catalog fetch throws after fixture fallback also failed. */
export function EventListError({
  onRetry,
  locale = 'zh-TW',
}: EventListErrorProps) {
  const copy = demoCopy(locale);
  const retry = onRetry ?? (() => window.location.reload());
  return (
    <div
      className='rounded-lg bg-white p-6 shadow-md'
      role='alert'
      data-testid='event-stack-api-error'
    >
      <div className='flex flex-col items-center justify-center space-y-4 py-12'>
        <div className='space-y-2 text-center'>
          <h2 className='font-medium text-red-600'>{copy.loadError}</h2>
          <p className='text-sm text-gray-500'>{copy.loadErrorHint}</p>
        </div>
        <button
          type='button'
          className='rounded-md bg-slate-900 px-4 py-2 text-sm text-white'
          onClick={retry}
        >
          {copy.retry}
        </button>
      </div>
    </div>
  );
}
