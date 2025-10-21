import { type FC } from 'react';

import { type LibConfig } from '../../../data/libs.config';
import { useLibsTranslation } from '../hooks/useLibsTranslation';

interface LibCardProps {
  lib: LibConfig;
}

export const LibCard: FC<LibCardProps> = ({ lib }) => {
  const { t } = useLibsTranslation();

  const categoryColors = {
    ui: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    data: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    utils: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {String(t(`libs.${lib.id}.name` as any))}
          </h3>
          <code className='text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
            {lib.packageName}
          </code>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[lib.category]
          }`}
        >
          {String(t(`categories.${lib.category}` as any))}
        </span>
      </div>

      {/* Description */}
      <p className='text-gray-600 dark:text-gray-400 mb-4'>
        {String(t(`libs.${lib.id}.description` as any))}
      </p>

      {/* Purpose */}
      <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
        <p className='text-sm text-blue-900 dark:text-blue-200 font-medium'>
          {String(t(`libs.${lib.id}.purpose` as any))}
        </p>
      </div>

      {/* Stats */}
      {lib.stats && (
        <div className='flex gap-4 mb-4'>
          {lib.stats.components && (
            <div className='text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {lib.stats.components}+
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-400'>
                Components
              </div>
            </div>
          )}
          {lib.stats.hooks && (
            <div className='text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {lib.stats.hooks}
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-400'>
                Hooks
              </div>
            </div>
          )}
          {lib.stats.utilities && (
            <div className='text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {lib.stats.utilities}+
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-400'>
                Utilities
              </div>
            </div>
          )}
        </div>
      )}

      {/* Highlights */}
      <div>
        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
          Highlights:
        </h4>
        <ul className='space-y-1'>
          {(
            t(`libs.${lib.id}.highlights` as any, {
              returnObjects: true,
            }) as string[]
          )
            .slice(0, 4)
            .map((highlight: string, index: number) => (
              <li
                key={index}
                className='text-sm text-gray-600 dark:text-gray-400 flex items-start'
              >
                <span className='text-green-600 dark:text-green-400 mr-2'>
                  ✓
                </span>
                {highlight}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
