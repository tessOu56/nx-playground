'use client';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
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
      className='rounded-xl border border-border bg-card p-6 shadow-sm'
      role='alert'
      data-testid='event-stack-api-error'
    >
      <div className='flex flex-col items-center justify-center space-y-4 py-12'>
        <div className='space-y-2 text-center'>
          <h2 className='font-semibold text-foreground'>{copy.loadError}</h2>
          <p className='text-sm text-muted-foreground'>{copy.loadErrorHint}</p>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-3'>
          <button
            type='button'
            className='rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90'
            onClick={retry}
          >
            {copy.retry}
          </button>
          <LineOfficialCta locale={locale} />
        </div>
      </div>
    </div>
  );
}
