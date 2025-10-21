import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { TechTag } from '../../../components/TechTag';
import { type AppConfig } from '../../../data/apps.config';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useAppsTranslation } from '../hooks/useAppsTranslation';

interface AppDetailProps {
  app: AppConfig;
}

export const AppDetail: FC<AppDetailProps> = ({ app }) => {
  const { t } = useAppsTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4'>
      <div className='max-w-5xl mx-auto'>
        {/* Back Button */}
        <Link
          to={getLocalizedPath('/apps')}
          className='inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          {String(t('detail.backToApps'))}
        </Link>

        {/* Header */}
        <div className='mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {String(t(`apps.${app.id}.name` as any))}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400'>
            {String(t(`apps.${app.id}.description` as any))}
          </p>
        </div>

        {/* Tech Stack */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            {String(t('detail.techStack'))}
          </h2>
          <div className='flex flex-wrap gap-3'>
            {app.techStack.map(tech => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            {String(t('detail.keyFeatures'))}
          </h2>
          <ul className='space-y-3'>
            {app.features.map((feature, index) => (
              <li key={index} className='flex items-start'>
                <svg
                  className='w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <span className='text-gray-700 dark:text-gray-300'>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Technical Highlights */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            {String(t('detail.highlights'))}
          </h2>
          <div className='space-y-4'>
            {app.highlights.map((highlight, index) => (
              <div
                key={index}
                className='flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
              >
                <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0'>
                  {index + 1}
                </div>
                <p className='text-gray-700 dark:text-gray-300'>{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Links & Actions */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            {String(t('detail.links'))}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {app.demoUrl ? (
              <a
                href={app.demoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-medium transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
                {String(t('detail.viewDemo'))}
              </a>
            ) : (
              <div className='flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-4 rounded-lg font-medium cursor-not-allowed'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                {String(t('card.comingSoon'))}
              </div>
            )}

            {app.githubUrl && (
              <a
                href={app.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-lg font-medium transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
                {String(t('detail.viewGitHub'))}
              </a>
            )}
          </div>

          {/* Local Dev Command */}
          <div className='mt-6 p-4 bg-gray-900 dark:bg-black rounded-lg'>
            <p className='text-gray-400 text-sm mb-2'>
              {String(t('detail.localDev'))}:
            </p>
            <code className='text-green-400 font-mono'>
              {app.localDevCommand}
            </code>
          </div>
        </section>
      </div>
    </div>
  );
};
