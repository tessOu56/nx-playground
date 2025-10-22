import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { getLocalizedPath } = useLocalizedNavigation();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4'>
          404
        </h1>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          Page Not Found
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className='flex gap-4 justify-center'>
          <button
            onClick={() => navigate(getLocalizedPath('/'))}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

