import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { type AppConfig } from '../../../data/apps.config';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useAppsTranslation } from '../hooks/useAppsTranslation';

interface AppCardProps {
  app: AppConfig;
}

export const AppCard: FC<AppCardProps> = ({ app }) => {
  const { t } = useAppsTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();

  const categoryColors = {
    react: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    angular: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    vue: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    nextjs: 'bg-black text-white dark:bg-white dark:text-black',
  };

  return (
    <div className='group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2'>
      <div className='p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              {String(t(`apps.${app.id}.name` as any))}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                categoryColors[app.category]
              }`}
            >
              {app.category.toUpperCase()}
            </span>
          </div>
          {app.status === 'coming-soon' && (
            <span className='px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium'>
              {String(t('card.comingSoon'))}
            </span>
          )}
        </div>

        {/* Description */}
        <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
          {String(t(`apps.${app.id}.shortDesc` as any))}
        </p>

        {/* Tech Stack Preview */}
        <div className='mb-4'>
          <div className='flex flex-wrap gap-2'>
            {app.techStack.slice(0, 4).map(tech => (
              <span
                key={tech}
                className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium'
              >
                {tech}
              </span>
            ))}
            {app.techStack.length > 4 && (
              <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium'>
                +{app.techStack.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-3 mt-6'>
          <Link
            to={getLocalizedPath(`/apps/${app.id}`)}
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors'
          >
            {String(t('card.viewDetails'))}
          </Link>
          {app.demoUrl && (
            <a
              href={app.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors'
            >
              {String(t('card.demoLink'))}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
