import { Home, Search, FileText, Briefcase } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/SEO';
import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();

  const quickLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: FileText, label: 'Blog', path: '/blogs' },
    { icon: Search, label: 'AI Search', path: '/search' },
  ];

  return (
    <>
      <SEO
        title='Page Not Found'
        description='The page you are looking for does not exist.'
      />
      
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4'>
        <div className='text-center max-w-2xl'>
          <h1 className='text-9xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            404
          </h1>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Page Not Found
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Quick Links */}
          <div className='mb-8'>
            <p className='text-sm text-gray-500 dark:text-gray-500 mb-4'>
              Try one of these instead:
            </p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {quickLinks.map(({ icon: Icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(getLocalizedPath(path))}
                  className='flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:shadow-lg transition-all'
                >
                  <Icon className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-center'>
            <button
              onClick={() => navigate(getLocalizedPath('/'))}
              className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all'
            >
              Go Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className='px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

