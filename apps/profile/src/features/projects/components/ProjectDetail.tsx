import { track } from '@nx-playground/analytics';
import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { TechTag } from '../../../components/TechTag';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import type { ProjectData } from '../../../types/projectData';
import { useDetailTranslation } from '../hooks/useDetailTranslation';

interface ProjectDetailProps {
  project: ProjectData;
  type: 'app' | 'lib';
}

export const ProjectDetail: FC<ProjectDetailProps> = ({ project, type }) => {
  const { t } = useDetailTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  const [showAllVersions, setShowAllVersions] = useState(false);

  // Track project view
  useEffect(() => {
    track('project_viewed', {
      projectId: project.id,
      projectName: project.name || project.id,
      type,
      status: project.status,
      category: project.category || 'unknown',
    });
  }, [project.id, project.name, project.status, project.category, type]);

  const backPath = '/projects';
  const backText = type === 'app' ? t('backToApps') : t('backToLibs');

  const displayedReleases = showAllVersions
    ? project.changelog?.releases
    : project.changelog?.releases?.slice(0, 3);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'production':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'development':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'production':
        return t('statusProduction');
      case 'development':
        return t('statusDevelopment');
      case 'coming-soon':
        return t('statusComingSoon');
      default:
        return status;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'text-green-600 dark:text-green-400';
      case 'changed':
        return 'text-blue-600 dark:text-blue-400';
      case 'fixed':
        return 'text-purple-600 dark:text-purple-400';
      case 'removed':
        return 'text-red-600 dark:text-red-400';
      case 'deprecated':
        return 'text-orange-600 dark:text-orange-400';
      case 'security':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'breaking':
        return 'text-red-700 dark:text-red-300 font-bold';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      {/* Notion-style full-width container */}
      <div className='max-w-4xl mx-auto px-6 sm:px-12 py-16'>
        {/* Back Button - Minimal */}
        <Link
          to={getLocalizedPath(backPath)}
          className='inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-12'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          <span>{String(backText)}</span>
        </Link>

        {/* Page Title - Notion style large heading */}
        <h1 className='text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-3 leading-tight'>
          {project.name}
        </h1>

        {/* Description - Subtle */}
        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
          {project.shortDesc || project.description}
        </p>

        {/* Metadata - Notion style inline properties */}
        <div className='flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-400 mb-12 pb-8 border-b border-gray-200 dark:border-gray-800'>
          {/* Status */}
          <div className='flex items-center gap-2'>
            <span className='text-gray-400'>Status</span>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeColor(project.status)}`}
            >
              {getStatusText(project.status)}
            </span>
          </div>

          {/* Version */}
          <div className='flex items-center gap-2'>
            <span className='text-gray-400'>Version</span>
            <span className='font-medium text-gray-900 dark:text-white'>
              v{project.version}
            </span>
          </div>

          {/* Category */}
          <div className='flex items-center gap-2'>
            <span className='text-gray-400'>Category</span>
            <span className='font-medium text-gray-900 dark:text-white capitalize'>
              {project.category}
            </span>
          </div>
        </div>

        {/* Purpose & Description - Notion clean section */}
        {project.purpose && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('purpose'))}
            </h2>
            <p className='text-base text-gray-700 dark:text-gray-300 leading-relaxed'>
              {project.purpose}
            </p>
          </section>
        )}

        {/* Tech Stack - Notion inline tags */}
        {project.techStack && project.techStack.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('techStack'))}
            </h2>
            <div className='flex flex-wrap gap-2'>
              {project.techStack.map(tech => (
                <TechTag key={tech} name={tech} />
              ))}
            </div>
          </section>
        )}

        {/* Key Features - Notion simple list */}
        {project.features && project.features.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('keyFeatures'))}
            </h2>
            <ul className='space-y-2'>
              {project.features.map((feature, index) => (
                <li key={index} className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                  <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Technical Highlights - Notion numbered list */}
        {project.highlights && project.highlights.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('highlights'))}
            </h2>
            <ol className='space-y-3 list-decimal list-inside'>
              {project.highlights.map((highlight, index) => (
                <li key={index} className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  {highlight}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Use Cases - Notion simple bullets */}
        {project.useCases && project.useCases.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('useCases'))}
            </h2>
            <ul className='space-y-2'>
              {project.useCases.map((useCase, index) => (
                <li key={index} className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                  <span className='text-blue-600 dark:text-blue-400 mt-1'>•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Target Audience - Notion paragraph */}
        {project.targetAudience && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('targetAudience'))}
            </h2>
            <p className='text-base text-gray-700 dark:text-gray-300 leading-relaxed'>
              {project.targetAudience}
            </p>
          </section>
        )}

        {/* Stats - Notion inline stats */}
        {project.stats && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('stats'))}
            </h2>
            <div className='flex flex-wrap gap-6'>
              {project.stats.components !== undefined && (
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {project.stats.components}
                  </span>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {String(t('statsComponents'))}
                  </span>
                </div>
              )}

              {project.stats.hooks !== undefined && (
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {project.stats.hooks}
                  </span>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {String(t('statsHooks'))}
                  </span>
                </div>
              )}

              {project.stats.utilities !== undefined && (
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {project.stats.utilities}
                  </span>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {String(t('statsUtilities'))}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Specification - Notion embedded content */}
        {project.specContent && (
          <section className='mb-12'>
            <div
              className='prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400'
              dangerouslySetInnerHTML={{ __html: project.specContent }}
            />
          </section>
        )}

        {/* Changelog - Notion timeline style */}
        {project.changelog && project.changelog.releases.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              {String(t('changelog'))}
            </h2>

            <div className='space-y-8'>
              {displayedReleases?.map((release, index) => (
                <div
                  key={index}
                  className='border-l-2 border-gray-200 dark:border-gray-700 pl-6'
                >
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                      v{release.version}
                    </span>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                      {release.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        release.type === 'major'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : release.type === 'minor'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {release.type}
                    </span>
                  </div>

                  <div className='space-y-2 text-sm'>
                    {release.changes.breaking &&
                      release.changes.breaking.length > 0 && (
                        <div>
                          <div className='font-medium text-red-600 dark:text-red-400 mb-1'>
                            ⚠️ {String(t('changelogBreaking'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.breaking.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.added &&
                      release.changes.added.length > 0 && (
                        <div>
                          <div className='font-medium text-green-600 dark:text-green-400 mb-1'>
                            ✨ {String(t('changelogAdded'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.added.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.changed &&
                      release.changes.changed.length > 0 && (
                        <div>
                          <div className='font-medium text-blue-600 dark:text-blue-400 mb-1'>
                            🔄 {String(t('changelogChanged'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.changed.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.fixed &&
                      release.changes.fixed.length > 0 && (
                        <div>
                          <div className='font-medium text-purple-600 dark:text-purple-400 mb-1'>
                            🐛 {String(t('changelogFixed'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.fixed.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.removed &&
                      release.changes.removed.length > 0 && (
                        <div>
                          <div className='font-medium text-orange-600 dark:text-orange-400 mb-1'>
                            🗑️ {String(t('changelogRemoved'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.removed.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.deprecated &&
                      release.changes.deprecated.length > 0 && (
                        <div>
                          <div className='font-medium text-yellow-600 dark:text-yellow-400 mb-1'>
                            ⚠️ {String(t('changelogDeprecated'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.deprecated.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.security &&
                      release.changes.security.length > 0 && (
                        <div>
                          <div className='font-medium text-red-600 dark:text-red-400 mb-1'>
                            🔒 {String(t('changelogSecurity'))}
                          </div>
                          <ul className='space-y-1 ml-4'>
                            {release.changes.security.map((item, i) => (
                              <li key={i} className='text-gray-600 dark:text-gray-400'>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button - Notion subtle link */}
            {project.changelog.releases.length > 3 && (
              <button
                onClick={() => setShowAllVersions(!showAllVersions)}
                className='mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline'
              >
                {showAllVersions
                  ? String(t('hideVersions'))
                  : String(t('showAllVersions'))}{' '}
                ({project.changelog.releases.length})
              </button>
            )}
          </section>
        )}

        {/* Links & Resources - Notion inline links */}
        <section className='mb-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex flex-wrap gap-4'>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                </svg>
                <span>{String(t('viewDemo'))}</span>
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm'
              >
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
                <span>{String(t('viewGitHub'))}</span>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
