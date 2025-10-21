import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { appsConfig } from '../../../data/apps.config';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { loadAllApps } from '../../../lib/projectLoader';
import type { AppData } from '../../../types/projectData';
import { AppCard } from '../components';
import { useAppsTranslation } from '../hooks/useAppsTranslation';

export const AppsPage: FC = () => {
  const { t } = useAppsTranslation();
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;

  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);

  // 載入 Apps 資料
  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      try {
        const loadedApps = await loadAllApps(currentLocale);

        // 如果成功載入資料，使用新載入器的資料
        if (loadedApps.length > 0) {
          setApps(loadedApps);
        } else {
          // Fallback 到 config（向後相容）
          setApps(appsConfig as any);
        }
      } catch (error) {
        console.error('Failed to load apps:', error);
        // Fallback 到 config
        setApps(appsConfig as any);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [currentLocale]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>載入中...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {String(t('page.title'))}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            {String(t('page.subtitle'))}
          </p>
        </div>

        {/* Apps Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {/* Stats Section */}
        <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
            <div className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
              {apps.length}
            </div>
            <div className='text-gray-600 dark:text-gray-400 font-medium'>
              {String(t('page.title'))}
            </div>
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
            <div className='text-4xl font-bold text-green-600 dark:text-green-400 mb-2'>
              3
            </div>
            <div className='text-gray-600 dark:text-gray-400 font-medium'>
              Frameworks
            </div>
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
            <div className='text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
              30+
            </div>
            <div className='text-gray-600 dark:text-gray-400 font-medium'>
              Technologies
            </div>
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
            <div className='text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2'>
              100%
            </div>
            <div className='text-gray-600 dark:text-gray-400 font-medium'>
              TypeScript
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
