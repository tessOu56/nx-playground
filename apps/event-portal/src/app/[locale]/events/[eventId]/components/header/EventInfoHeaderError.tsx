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
      className='bg-white rounded-lg shadow-md p-6'
      role='alert'
      data-testid={isApi ? 'event-stack-api-error' : 'event-not-found'}
    >
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <div className='text-center space-y-2'>
          <div className='text-red-600 font-medium'>
            {isApi ? copy.loadError : copy.notFound}
          </div>
          <div className='text-gray-500 text-sm'>
            {isApi ? copy.loadErrorHint : copy.notFoundHint}
          </div>
        </div>
      </div>
    </div>
  );
}
