import { type FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProjectCard } from '../../../components/ProjectCard';
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

  const [filter, setFilter] = useState<'all' | 'react-apps' | 'react-libs' | 'others'>('all');

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

  // No search filtering, show all projects
  const filteredApps = apps;
  const filteredLibs = libs;

  // Filter React apps and other framework apps
  const reactApps = useMemo(() => {
    return filteredApps.filter(app =>
      app.techStack?.some(tech => tech.toLowerCase().includes('react'))
    );
  }, [filteredApps]);

  const otherFrameworkApps = useMemo(() => {
    return filteredApps.filter(
      app =>
        app.techStack?.some(
          tech =>
            tech.toLowerCase().includes('angular') ||
            tech.toLowerCase().includes('vue')
        ) && !app.techStack?.some(tech => tech.toLowerCase().includes('react'))
    );
  }, [filteredApps]);

  // Filter React libs only (ui category)
  const reactLibs = useMemo(() => {
    return filteredLibs.filter(lib => lib.category === 'ui');
  }, [filteredLibs]);

  // Filter based on dropdown selection
  const shouldShowSection = (section: string) => {
    if (filter === 'all') return true;
    return filter === section;
  };

  const totalProjects = apps.length + libs.length;

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          Loading projects...
        </p>
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

        {/* Quick Filter */}
        <div className='max-w-md mx-auto mb-12'>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as typeof filter)}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label='Filter projects'
          >
            <option value='all'>All Projects</option>
            <option value='react-apps'>React Applications</option>
            <option value='react-libs'>React Libraries</option>
            <option value='others'>Other Frameworks</option>
          </select>
        </div>

        {/* Stats */}
        {filter === 'all' && (
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

        {/* React Apps Section */}
        {shouldShowSection('react-apps') && (
        <section id='react-apps' className='mb-16'>
          <div className='mb-8'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              React Applications
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Production-ready React applications
            </p>
          </div>

          {reactApps.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {reactApps.map(app => (
                <ProjectCard
                  key={app.id}
                  project={app}
                  type='app'
                  onClick={() =>
                    navigate(getLocalizedPath(`/projects/${app.id}`))
                  }
                />
              ))}
            </div>
          ) : !searchTerm ? null : (
            <p className='text-center text-gray-600 dark:text-gray-400 py-8'>
              {ts(t, 'noResults')}
            </p>
          )}
        </section>

        {/* React Libs Section */}
        <section id='react-libs' className='mb-16'>
          <div className='mb-8'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              React Libraries
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Reusable React components and utilities
            </p>
          </div>

          {reactLibs.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {reactLibs.map(lib => (
                <ProjectCard
                  key={lib.id}
                  project={lib}
                  type='lib'
                  onClick={() =>
                    navigate(getLocalizedPath(`/projects/${lib.id}`))
                  }
                />
              ))}
            </div>
          ) : !searchTerm ? null : (
            <p className='text-center text-gray-600 dark:text-gray-400 py-8'>
              {ts(t, 'noResults')}
            </p>
          )}
        </section>

        {/* Other Framework Practice Section */}
        {!searchTerm && otherFrameworkApps.length > 0 && (
          <section id='other-frameworks' className='mb-16'>
            <div className='mb-8'>
              <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                Other Framework Practice
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-400'>
                Angular and Vue exploration projects
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {otherFrameworkApps.map(app => (
                <ProjectCard
                  key={app.id}
                  project={app}
                  type='app'
                  onClick={() =>
                    navigate(getLocalizedPath(`/projects/${app.id}`))
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
