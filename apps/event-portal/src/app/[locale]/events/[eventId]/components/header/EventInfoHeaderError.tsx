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
      className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'
      role='alert'
      data-testid={isApi ? 'event-stack-api-error' : 'event-not-found'}
    >
      <div className='flex flex-col items-center justify-center space-y-2 py-12 text-center'>
        <h2 className='font-semibold text-gray-900'>
          {isApi ? copy.loadError : copy.notFound}
        </h2>
        <p className='text-sm text-gray-600'>
          {isApi ? copy.loadErrorHint : copy.notFoundHint}
        </p>
      </div>
    </div>
  );
}
