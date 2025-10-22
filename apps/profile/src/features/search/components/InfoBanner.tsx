import type { FC } from 'react';

export const InfoBanner: FC = () => {
  return (
    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
      <div className='flex items-start gap-3'>
        <svg
          className='w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5'
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
        <div>
          <h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-1'>
            AI-Powered Knowledge Assistant
          </h3>
          <p className='text-sm text-blue-800 dark:text-blue-200'>
            This AI assistant is powered by knowledge of all my projects, blog posts, and tech stack.
            Ask anything about my work, experience, or technical capabilities!
          </p>
        </div>
      </div>
    </div>
  );
};

