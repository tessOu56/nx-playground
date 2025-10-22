import { type FC, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ProjectCard } from '../../../components/ProjectCard';
import { SearchBar } from '../../../components/SearchBar';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { ts } from '../../../lib/i18n/helpers';
import { useProjectsStore } from '../../../stores/useProjectsStore';
import type { LibData } from '../../../types/projectData';
import { useProjectsTranslation } from '../hooks/useProjectsTranslation';
import '../i18n';

export const ProjectsPage: FC = () => {
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { getLocalizedPath } = useLocalizedNavigation();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const { t } = useProjectsTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') ?? '';

  // Get data from Zustand store
  const apps = useProjectsStore(state => state.apps[currentLocale]);
  const libs = useProjectsStore(state => state.libs[currentLocale]);
  const loading = useProjectsStore(state => state.loading);
  const loadApps = useProjectsStore(state => state.loadApps);
  const loadLibs = useProjectsStore(state => state.loadLibs);

  // Load data
  useEffect(() => {
    loadApps(currentLocale);
    loadLibs(currentLocale);
  }, [currentLocale, loadApps, loadLibs]);

  // Filter apps and libs by search term
  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return apps;

    const lowerSearch = searchTerm.toLowerCase();
    return apps.filter(app => {
      const matchName = app.name.toLowerCase().includes(lowerSearch);
      const matchDesc = (app.description || '').toLowerCase().includes(lowerSearch);
      const matchTech = app.techStack?.some(tech =>
        tech.toLowerCase().includes(lowerSearch)
      );

      return matchName || matchDesc || matchTech;
    });
  }, [apps, searchTerm]);

  const filteredLibs = useMemo(() => {
    if (!searchTerm.trim()) return libs;

    const lowerSearch = searchTerm.toLowerCase();
    return libs.filter(lib => {
      const matchName = lib.name.toLowerCase().includes(lowerSearch);
      const matchDesc = (lib.description || '').toLowerCase().includes(lowerSearch);
      const matchTech = lib.techStack?.some(tech =>
        tech.toLowerCase().includes(lowerSearch)
      );
      const categoryTranslated = ts(t, `categories.${lib.category}`);
      const matchCategory =
        lib.category.toLowerCase().includes(lowerSearch) ||
        (categoryTranslated !== `categories.${lib.category}` &&
          categoryTranslated.toLowerCase().includes(lowerSearch));

      return matchName || matchDesc || matchTech || matchCategory;
    });
  }, [libs, searchTerm, t]);

  // Group filtered libs by category
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

  const totalProjects = apps.length + libs.length;

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-gray-600 dark:text-gray-400'>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {ts(t, 'title')}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            {ts(t, 'subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={ts(t, 'searchPlaceholder')}
        />

        {/* Stats */}
        {!searchTerm && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                {totalProjects}
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium text-sm'>
                {ts(t, 'stats.totalProjects')}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400 mb-2'>
                {apps.length}
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium text-sm'>
                {ts(t, 'stats.applications')}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
                {libs.length}
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium text-sm'>
                {ts(t, 'stats.libraries')}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center'>
              <div className='text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2'>
                100%
              </div>
              <div className='text-gray-600 dark:text-gray-400 font-medium text-sm'>
                {ts(t, 'stats.typescript')}
              </div>
            </div>
          </div>
        )}

        {/* Apps Section */}
        <section id='apps' className='mb-16'>
          <div className='mb-8'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              {ts(t, 'sections.apps')}
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              {ts(t, 'sections.appsDesc')}
            </p>
          </div>

          {filteredApps.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredApps.map(app => (
                <ProjectCard
                  key={app.id}
                  project={app}
                  type='app'
                  onClick={() => navigate(getLocalizedPath(`/projects/${app.id}`))}
                />
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-600 dark:text-gray-400 py-8'>
              {ts(t, 'noResults')}
            </p>
          )}
        </section>

        {/* Libs Section */}
        <section id='libs'>
          <div className='mb-8'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              {ts(t, 'sections.libs')}
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              {ts(t, 'sections.libsDesc')}
            </p>
          </div>

          {filteredLibs.length > 0 ? (
            Object.entries(groupedLibs).map(([category, categoryLibs]) => (
              <div key={category} className='mb-12'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                  {ts(t, `categories.${category}`) !== `categories.${category}`
                    ? ts(t, `categories.${category}`)
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {categoryLibs.map(lib => (
                    <ProjectCard
                      key={lib.id}
                      project={lib}
                      type='lib'
                      onClick={() => navigate(getLocalizedPath(`/projects/${lib.id}`))}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-600 dark:text-gray-400 py-8'>
              {ts(t, 'noResults')}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

