import { useTranslation } from '@nx-playground/i18n';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { appsConfig } from '../../../data/apps.config';
import {
  libBenefits,
  libCategories,
  libsConfig,
} from '../../../data/libs.config';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { loadAllLibs } from '../../../lib/projectLoader';
import type { LibData } from '../../../types/projectData';
import { LibCard } from '../components';
import { useLibsTranslation } from '../hooks/useLibsTranslation';

export const LibsPage: FC = () => {
  const { t } = useLibsTranslation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'zh-TW' | 'en';
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;

  const [libs, setLibs] = useState<LibData[]>([]);
  const [loading, setLoading] = useState(true);

  // 載入 Libs 資料
  useEffect(() => {
    const loadLibsData = async () => {
      setLoading(true);
      try {
        const loadedLibs = await loadAllLibs(currentLocale);

        if (loadedLibs.length > 0) {
          setLibs(loadedLibs);
        } else {
          // Fallback 到 config
          setLibs(libsConfig as any);
        }
      } catch (error) {
        console.error('Failed to load libs:', error);
        setLibs(libsConfig as any);
      } finally {
        setLoading(false);
      }
    };

    loadLibsData();
  }, [currentLocale]);

  const groupedLibs = useMemo(() => {
    const grouped: Record<string, typeof libs> = {};
    libs.forEach(lib => {
      if (!grouped[lib.category]) {
        grouped[lib.category] = [];
      }
      grouped[lib.category].push(lib);
    });
    return grouped;
  }, [libs]);

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
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4'>
            {String(t('page.subtitle'))}
          </p>
          <p className='text-lg text-gray-500 dark:text-gray-500 max-w-4xl mx-auto'>
            {String(t('page.intro'))}
          </p>
        </div>

        {/* Libraries by Category */}
        {Object.entries(groupedLibs).map(([category, libs]) => (
          <section key={category} className='mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
              {
                libCategories[category as keyof typeof libCategories][
                  currentLang
                ]
              }
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {libs.map(lib => (
                <LibCard key={lib.id} lib={lib} />
              ))}
            </div>
          </section>
        ))}

        {/* Benefits Section */}
        <section className='mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center'>
            {String(t('benefits.title'))}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {libBenefits.map((benefit, index) => (
              <div
                key={index}
                className='p-6 bg-gray-50 dark:bg-gray-700 rounded-lg'
              >
                <div className='w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4'>
                  {index + 1}
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                  {benefit.title[currentLang]}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {benefit.description[currentLang]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Monorepo Architecture */}
        <section className='mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white'>
          <h2 className='text-3xl font-bold mb-4 text-center'>
            {currentLang === 'zh-TW'
              ? 'Nx Monorepo 架構'
              : 'Nx Monorepo Architecture'}
          </h2>
          <p className='text-center text-lg mb-6 opacity-90'>
            {currentLang === 'zh-TW'
              ? '所有函式庫在 Nx monorepo 中管理，確保一致性和可維護性'
              : 'All libraries are managed in an Nx monorepo, ensuring consistency and maintainability'}
          </p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>{libs.length}</div>
              <div className='text-sm opacity-90'>
                {currentLang === 'zh-TW' ? '函式庫' : 'Libraries'}
              </div>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>{appsConfig.length}</div>
              <div className='text-sm opacity-90'>
                {currentLang === 'zh-TW' ? '應用程式' : 'Applications'}
              </div>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>100%</div>
              <div className='text-sm opacity-90'>TypeScript</div>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>100%</div>
              <div className='text-sm opacity-90'>
                {currentLang === 'zh-TW' ? '可重用' : 'Reusable'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
