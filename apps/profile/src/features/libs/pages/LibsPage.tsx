import { type FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { loadAllLibs } from '../../../lib/projectLoader';
import type { LibData } from '../../../types/projectData';
import { LibCard } from '../components';

export const LibsPage: FC = () => {
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
        setLibs(loadedLibs);
      } catch (error) {
        console.error('Failed to load libs:', error);
        setLibs([]);
      } finally {
        setLoading(false);
      }
    };

    loadLibsData();
  }, [currentLocale]);

  const groupedLibs = useMemo(() => {
    const grouped: Record<string, LibData[]> = {};
    libs.forEach(lib => {
      if (!grouped[lib.category]) {
        grouped[lib.category] = [];
      }
      grouped[lib.category].push(lib);
    });
    return grouped;
  }, [libs]);

  const categoryNames: Record<string, string> = {
    ui: 'UI & Design',
    data: 'Data & State',
    utils: 'Utilities & Tools',
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Shared Libraries
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4'>
            Reusable components, hooks, and utilities across the monorepo
          </p>
          <p className='text-lg text-gray-500 dark:text-gray-500 max-w-4xl mx-auto'>
            Built with TypeScript for type safety and consistency
          </p>
        </div>

        {/* Libraries by Category */}
        {Object.entries(groupedLibs).map(([category, categoryLibs]) => (
          <section key={category} className='mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
              {categoryNames[category] ?? category}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {categoryLibs.map(lib => (
                <LibCard key={lib.id} lib={lib} />
              ))}
            </div>
          </section>
        ))}

        {/* Monorepo Architecture */}
        <section className='mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white'>
          <h2 className='text-3xl font-bold mb-4 text-center'>
            Nx Monorepo Architecture
          </h2>
          <p className='text-center text-lg mb-6 opacity-90'>
            All libraries are managed in an Nx monorepo, ensuring consistency and
            maintainability
          </p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>{libs.length}</div>
              <div className='text-sm opacity-90'>Libraries</div>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>7</div>
              <div className='text-sm opacity-90'>Applications</div>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>100%</div>
              <div className='text-sm opacity-90'>TypeScript</div>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
              <div className='text-3xl font-bold mb-1'>100%</div>
              <div className='text-sm opacity-90'>Reusable</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
