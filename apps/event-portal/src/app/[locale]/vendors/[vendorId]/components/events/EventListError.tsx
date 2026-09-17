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
  return (
    <div
      className='rounded-lg bg-white p-6 shadow-md'
      role='alert'
      data-testid='event-stack-api-error'
    >
      <div className='flex flex-col items-center justify-center space-y-4 py-12'>
        <div className='space-y-2 text-center'>
          <div className='font-medium text-red-600'>{copy.loadError}</div>
          <div className='text-sm text-gray-500'>{copy.loadErrorHint}</div>
        </div>
        {onRetry ? (
          <button
            type='button'
            className='rounded-md bg-slate-900 px-4 py-2 text-sm text-white'
            onClick={onRetry}
          >
            {copy.retry}
          </button>
        ) : null}
      </div>
    </div>
  );
}
