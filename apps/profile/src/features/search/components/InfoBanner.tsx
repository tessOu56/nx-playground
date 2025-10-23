import type { FC } from 'react';

export const InfoBanner: FC = () => {
  return (
    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
      <div className='flex items-center gap-3'>
        <svg
          className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <p className='text-sm text-blue-800 dark:text-blue-200'>
          AI assistant powered by knowledge of all projects, blogs, and tech stack
        </p>
      </div>
    </div>
  );
};

