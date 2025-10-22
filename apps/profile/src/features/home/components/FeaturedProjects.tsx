import { type FC, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { TechTag } from '../../../components/TechTag';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useProjectsStore } from '../../../stores/useProjectsStore';
import type { AppData } from '../../../types/projectData';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';

export const FeaturedProjects: FC = () => {
  const { t, i18n } = useHomeTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  const currentLocale = i18n.language as 'zh-TW' | 'en';
  
  const { apps, loadApps } = useProjectsStore();
  const currentApps = apps[currentLocale];

  useEffect(() => {
    loadApps(currentLocale);
  }, [currentLocale, loadApps]);

  // Filter featured projects (production status, top 3)
  const featuredApps = currentApps
    .filter(app => app.status === 'production')
    .slice(0, 3);

  if (featuredApps.length === 0) {
    return null;
  }

  return (
    <section className='container mx-auto px-4 py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            {String(t('featured.title'))}
          </h2>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {featuredApps.map((app: AppData) => (
            <Link
              key={app.id}
              to={getLocalizedPath(`/apps/${app.id}`)}
              className='group'
            >
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700'>
                {/* Project Image Placeholder */}
                <div className='h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 flex items-center justify-center relative overflow-hidden'>
                  <div className='absolute inset-0 bg-grid-pattern opacity-10' />
                  <svg
                    className='w-20 h-20 text-primary/40 relative z-10'
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

                {/* Project Content */}
                <div className='p-6 flex-1 flex flex-col'>
                  {/* Title */}
                  <h3 className='text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors'>
                    {app.name}
                  </h3>

                  {/* Description */}
                  <p className='text-muted-foreground mb-4 line-clamp-2 flex-1'>
                    {app.shortDesc || app.description}
                  </p>

                  {/* Tech Stack */}
                  {app.techStack && app.techStack.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {app.techStack.slice(0, 4).map(tech => (
                        <TechTag key={tech} name={tech} compact />
                      ))}
                      {app.techStack.length > 4 && (
                        <span className='text-xs text-muted-foreground self-center'>
                          +{app.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* View Detail */}
                  <div className='flex items-center text-primary font-medium group-hover:gap-2 transition-all'>
                    <span>{String(t('featured.viewDetail'))}</span>
                    <svg
                      className='w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className='text-center mt-12'>
          <Link
            to={getLocalizedPath('/apps')}
            className='inline-flex items-center gap-2 text-primary hover:underline font-medium text-lg'
          >
            {String(t('featured.viewAll'))}
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
                d='M17 8l4 4m0 0l-4 4m4-4H3'
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

