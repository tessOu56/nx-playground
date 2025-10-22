import { type FC, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ProjectCard } from '../../../components/ProjectCard';
import { SearchBar } from '../../../components/SearchBar';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useProjectsStore } from '../../../stores/useProjectsStore';
import { useAppsTranslation } from '../hooks/useAppsTranslation';
import '../i18n';

export const AppsPage: FC = () => {
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { getLocalizedPath } = useLocalizedNavigation();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const { t } = useAppsTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  // 從 Zustand store 取得資料
  const apps = useProjectsStore(state => state.apps[currentLocale]);
  const loading = useProjectsStore(state => state.loading);
  const loadApps = useProjectsStore(state => state.loadApps);

  // 載入 Apps 資料
  useEffect(() => {
    loadApps(currentLocale);
  }, [currentLocale, loadApps]);

  // Filter apps by search term
  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return apps;

    const lowerSearch = searchTerm.toLowerCase();
    return apps.filter((app) => {
      const matchName = app.name.toLowerCase().includes(lowerSearch);
      const matchDesc = (app.description || '').toLowerCase().includes(lowerSearch);
      const matchShortDesc = (app.shortDesc || '').toLowerCase().includes(lowerSearch);
      const matchTech = app.techStack?.some((tech) =>
        tech.toLowerCase().includes(lowerSearch)
      );

      return matchName || matchDesc || matchShortDesc || matchTech;
    });
  }, [apps, searchTerm]);

  const handleSearchChange = (value: string) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
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
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6'>
            <svg
              className='w-10 h-10 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
              />
            </svg>
          </div>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {String(t('title'))}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            {String(t('subtitle'))}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={String(t('searchPlaceholder'))}
        />

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredApps.map(app => (
              <ProjectCard
                key={app.id}
                project={app}
                type='app'
                onClick={() => navigate(getLocalizedPath(`/apps/${app.id}`))}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              {String(t('noResults'))}
            </p>
          </div>
        )}

        {/* Stats Section - only show when no search */}
        {!searchTerm && (
          <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                {apps.length}
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium'>
                {String(t('stats.applications'))}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400 mb-2'>
                3
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium'>
                {String(t('stats.frameworks'))}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
                30+
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium'>
                {String(t('stats.technologies'))}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2'>
                100%
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium'>
                {String(t('stats.typescript'))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
