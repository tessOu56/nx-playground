import { demoCopy } from '@/libs/i18n/demo-copy';

interface EventInfoHeaderErrorProps {
  kind?: 'api' | 'not-found';
  locale?: string;
}

export function EventInfoHeaderError({
  kind = 'not-found',
  locale = 'zh-TW',
}: EventInfoHeaderErrorProps) {
  const isApi = kind === 'api';
  const copy = demoCopy(locale);
  return (
    <div
      className='rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8'
      role='alert'
      data-testid={isApi ? 'event-stack-api-error' : 'event-not-found'}
    >
      <div className='mx-auto max-w-md py-8 text-center sm:py-10'>
        {isApi ? null : (
          <p className='text-sm font-medium text-muted-foreground'>404</p>
        )}
        <h1 className='mt-2 font-display text-2xl font-semibold tracking-tight text-foreground'>
          {isApi ? copy.loadError : copy.notFound}
        </h1>
        <p className='mt-3 text-sm leading-6 text-muted-foreground'>
          {isApi ? copy.loadErrorHint : copy.notFoundHint}
        </p>
      </div>
    </div>
  );
}
