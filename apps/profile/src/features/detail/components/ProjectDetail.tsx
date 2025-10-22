import { type FC, useState } from 'react';
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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4'>
      <div className='max-w-5xl mx-auto'>
        {/* 1. Back Button */}
        <Link
          to={getLocalizedPath(backPath)}
          className='inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          {String(backText)}
        </Link>

        {/* 2. Header Section */}
        <div className='mb-8'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {project.name}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400'>
            {project.shortDesc || project.description}
          </p>
        </div>

        {/* 3. Metadata Bar */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Status */}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-gray-600 dark:text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {String(t('status'))}
                </div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(project.status)}`}
                >
                  {getStatusText(project.status)}
                </div>
              </div>
            </div>

            {/* Version */}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-gray-600 dark:text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                  />
                </svg>
              </div>
              <div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {String(t('version'))}
                </div>
                <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                  v{project.version}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-gray-600 dark:text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                  />
                </svg>
              </div>
              <div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {String(t('category'))}
                </div>
                <div className='text-lg font-semibold text-gray-900 dark:text-white capitalize'>
                  {project.category}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Purpose & Description */}
        {project.purpose && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('purpose'))}
            </h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
              {project.purpose}
            </p>
          </section>
        )}

        {/* 5. Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('techStack'))}
            </h2>
            <div className='flex flex-wrap gap-3'>
              {project.techStack.map(tech => (
                <TechTag key={tech} name={tech} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Key Features */}
        {project.features && project.features.length > 0 && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('keyFeatures'))}
            </h2>
            <ul className='space-y-3'>
              {project.features.map((feature, index) => (
                <li key={index} className='flex items-start'>
                  <svg
                    className='w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 7. Technical Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('highlights'))}
            </h2>
            <div className='space-y-4'>
              {project.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className='flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
                >
                  <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0'>
                    {index + 1}
                  </div>
                  <p className='text-gray-700 dark:text-gray-300'>
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Use Cases */}
        {project.useCases && project.useCases.length > 0 && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('useCases'))}
            </h2>
            <ul className='space-y-3'>
              {project.useCases.map((useCase, index) => (
                <li key={index} className='flex items-start'>
                  <svg
                    className='w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {useCase}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 9. Target Audience */}
        {project.targetAudience && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('targetAudience'))}
            </h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
              {project.targetAudience}
            </p>
          </section>
        )}

        {/* 10. Stats (for libs) */}
        {project.stats && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('stats'))}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {project.stats.components !== undefined && (
                <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-7 h-7 text-blue-600 dark:text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z'
                      />
                    </svg>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                      {project.stats.components}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      {String(t('statsComponents'))}
                    </div>
                  </div>
                </div>
              )}

              {project.stats.hooks !== undefined && (
                <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-7 h-7 text-green-600 dark:text-green-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                      {project.stats.hooks}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      {String(t('statsHooks'))}
                    </div>
                  </div>
                </div>
              )}

              {project.stats.utilities !== undefined && (
                <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-7 h-7 text-purple-600 dark:text-purple-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                      {project.stats.utilities}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      {String(t('statsUtilities'))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 11. Documentation (README + Spec) */}
        {(project.readmeContent || project.specContent) && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('documentation'))}
            </h2>

            {/* README Content */}
            {project.readmeContent && (
              <div className='mb-8'>
                <h3 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  {String(t('readme'))}
                </h3>
                <div
                  className='prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400'
                  dangerouslySetInnerHTML={{ __html: project.readmeContent }}
                />
              </div>
            )}

            {/* Spec Content */}
            {project.specContent && (
              <div>
                <h3 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  {String(t('specContent'))}
                </h3>
                <div
                  className='prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400'
                  dangerouslySetInnerHTML={{ __html: project.specContent }}
                />
              </div>
            )}
          </section>
        )}

        {/* 12. Changelog */}
        {project.changelog && project.changelog.releases.length > 0 && (
          <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              {String(t('changelog'))}
            </h2>

            <div className='space-y-6'>
              {displayedReleases?.map((release, index) => (
                <div
                  key={index}
                  className='border-l-4 border-blue-600 dark:border-blue-400 pl-6 pb-6'
                >
                  <div className='flex items-center gap-4 mb-3'>
                    <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                      v{release.version}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        release.type === 'major'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : release.type === 'minor'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {release.type}
                    </span>
                    <span className='text-gray-500 dark:text-gray-400'>
                      {release.date}
                    </span>
                  </div>

                  <div className='space-y-3'>
                    {release.changes.breaking &&
                      release.changes.breaking.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('breaking')}`}
                          >
                            ⚠️ {String(t('changelogBreaking'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.breaking.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.added &&
                      release.changes.added.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('added')}`}
                          >
                            ✨ {String(t('changelogAdded'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.added.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.changed &&
                      release.changes.changed.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('changed')}`}
                          >
                            🔄 {String(t('changelogChanged'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.changed.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.fixed &&
                      release.changes.fixed.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('fixed')}`}
                          >
                            🐛 {String(t('changelogFixed'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.fixed.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.removed &&
                      release.changes.removed.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('removed')}`}
                          >
                            🗑️ {String(t('changelogRemoved'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.removed.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.deprecated &&
                      release.changes.deprecated.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('deprecated')}`}
                          >
                            ⚠️ {String(t('changelogDeprecated'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.deprecated.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {release.changes.security &&
                      release.changes.security.length > 0 && (
                        <div>
                          <h4
                            className={`font-semibold mb-2 ${getChangeTypeColor('security')}`}
                          >
                            🔒 {String(t('changelogSecurity'))}
                          </h4>
                          <ul className='list-disc list-inside space-y-1'>
                            {release.changes.security.map((item, i) => (
                              <li
                                key={i}
                                className='text-gray-700 dark:text-gray-300'
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {project.changelog.releases.length > 3 && (
              <button
                onClick={() => setShowAllVersions(!showAllVersions)}
                className='mt-6 w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors'
              >
                {showAllVersions
                  ? String(t('hideVersions'))
                  : String(t('showAllVersions'))}{' '}
                ({project.changelog.releases.length})
              </button>
            )}
          </section>
        )}

        {/* 13. Links & Resources */}
        <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            {String(t('links'))}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-medium transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
                {String(t('viewDemo'))}
              </a>
            ) : (
              <div className='flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-4 rounded-lg font-medium cursor-not-allowed'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                {String(t('comingSoon'))}
              </div>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-lg font-medium transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
                {String(t('viewGitHub'))}
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
