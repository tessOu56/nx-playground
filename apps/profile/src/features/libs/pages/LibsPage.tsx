import { type FC, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ProjectCard } from '../../../components/ProjectCard';
import { SearchBar } from '../../../components/SearchBar';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { ts } from '../../../lib/i18n/helpers';
import { useProjectsStore } from '../../../stores/useProjectsStore';
import type { LibData } from '../../../types/projectData';
import { useLibsTranslation } from '../hooks/useLibsTranslation';
import '../i18n';

export const LibsPage: FC = () => {
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { getLocalizedPath } = useLocalizedNavigation();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const { t } = useLibsTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  // 從 Zustand store 取得資料
  const libs = useProjectsStore(state => state.libs[currentLocale]);
  const loading = useProjectsStore(state => state.loading);
  const loadLibs = useProjectsStore(state => state.loadLibs);

  // 載入 Libs 資料
  useEffect(() => {
    loadLibs(currentLocale);
  }, [currentLocale, loadLibs]);

  // Filter libs by search term
  const filteredLibs = useMemo(() => {
    if (!searchTerm.trim()) return libs;

    const lowerSearch = searchTerm.toLowerCase();
    return libs.filter(lib => {
      const matchName = lib.name.toLowerCase().includes(lowerSearch);
      const matchDesc = (lib.description || '')
        .toLowerCase()
        .includes(lowerSearch);
      const matchShortDesc = (lib.shortDesc || '')
        .toLowerCase()
        .includes(lowerSearch);
      const matchTech = lib.techStack?.some(tech =>
        tech.toLowerCase().includes(lowerSearch)
      );
      // Also search by category (both original and translated)
      const categoryTranslated = ts(t, `categories.${lib.category}`);
      const matchCategory =
        lib.category.toLowerCase().includes(lowerSearch) ||
        (categoryTranslated !== `categories.${lib.category}` &&
          categoryTranslated.toLowerCase().includes(lowerSearch));

      return (
        matchName || matchDesc || matchShortDesc || matchTech || matchCategory
      );
    });
  }, [libs, searchTerm, t]);

  const groupedLibs = useMemo(() => {
    const grouped: Record<string, LibData[]> = {};
    filteredLibs.forEach(lib => {
      if (!grouped[lib.category]) {
        grouped[lib.category] = [];
      }
      grouped[lib.category].push(lib);
    });
    return grouped;
  }, [filteredLibs]);

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
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6'>
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
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
          </div>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {ts(t, 'title')}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4'>
            {ts(t, 'subtitle')}
          </p>
          <div className='flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
            <span className='flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-green-600 dark:text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              100% TypeScript
            </span>
            <span className='flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-green-600 dark:text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              Tree-Shakeable
            </span>
            <span className='flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-green-600 dark:text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              Framework Agnostic
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={ts(t, 'searchPlaceholder')}
        />

        {/* Libraries by Category */}
        {filteredLibs.length > 0 ? (
          Object.entries(groupedLibs).map(([category, categoryLibs]) => (
            <section key={category} className='mb-16'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
                {ts(t, `categories.${category}`) !== `categories.${category}`
                  ? ts(t, `categories.${category}`)
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {categoryLibs.map(lib => (
                  <ProjectCard
                    key={lib.id}
                    project={lib}
                    type='lib'
                    onClick={() =>
                      navigate(getLocalizedPath(`/libs/${lib.id}`))
                    }
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className='text-center py-16'>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              {ts(t, 'noResults')}
            </p>
          </div>
        )}

        {/* Monorepo Architecture - only show when no search */}
        {!searchTerm && (
          <section className='mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white'>
            <h2 className='text-3xl font-bold mb-4 text-center'>
              {ts(t, 'monorepoTitle')}
            </h2>
            <p className='text-center text-lg mb-6 opacity-90'>
              {ts(t, 'monorepoSubtitle')}
            </p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                <div className='text-3xl font-bold mb-1'>{libs.length}</div>
                <div className='text-sm opacity-90'>
                  {ts(t, 'stats.libraries')}
                </div>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                <div className='text-3xl font-bold mb-1'>7</div>
                <div className='text-sm opacity-90'>
                  {ts(t, 'stats.applications')}
                </div>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                <div className='text-3xl font-bold mb-1'>100%</div>
                <div className='text-sm opacity-90'>
                  {ts(t, 'stats.typescript')}
                </div>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                <div className='text-3xl font-bold mb-1'>100%</div>
                <div className='text-sm opacity-90'>
                  {ts(t, 'stats.reusable')}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
