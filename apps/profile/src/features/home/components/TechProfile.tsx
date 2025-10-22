import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { siteConfig } from '../../../lib/siteConfig';
import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';

export const TechProfile: FC = () => {
  const { t, i18n } = useHomeTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  const currentLang = i18n.language as 'zh-TW' | 'en';

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
      <div className='absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />

      <div className='relative container mx-auto px-4 py-20 md:py-32'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Logo / Name */}
          <div className='mb-8'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-4'>
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent'>
                {siteConfig.siteName}
              </span>
            </h1>
            <div className='h-[2px] w-24 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mx-auto' />
          </div>

          {/* Tagline */}
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8'>
            {homeConfig.tagline[currentLang]}
          </h2>

          {/* Short Bio */}
          <p className='text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12'>
            {homeConfig.shortBio[currentLang]}
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              to={getLocalizedPath('/apps')}
              className='inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto'
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
                  d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                />
              </svg>
              {String(t('hero.viewProjects'))}
            </Link>

            <a
              href='#contact'
              className='inline-flex items-center justify-center gap-2 border-2 border-primary hover:bg-primary/10 text-primary px-8 py-4 rounded-lg font-medium transition-all w-full sm:w-auto'
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
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              {String(t('hero.contactMe'))}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
