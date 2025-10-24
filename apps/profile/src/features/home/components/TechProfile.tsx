import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { siteConfig } from '../../../lib/siteConfig';
import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';

export const TechProfile: FC = () => {
  const { t, i18n } = useHomeTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  const navigate = useNavigate();
  const currentLang = i18n.language as 'zh-TW' | 'en';

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      className='relative overflow-hidden h-screen flex items-center'
      data-header-dark='true'
    >
      {/* Background with CSS gradient placeholder */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 dark:from-blue-800 dark:via-purple-800 dark:to-blue-800' />

      {/* Lorem-picsum background image - lazy loaded */}
      <img
        src='https://picsum.photos/1920/1080?random=1'
        loading='lazy'
        alt=''
        className='absolute inset-0 w-full h-full object-cover opacity-20'
        style={{ zIndex: 1 }}
      />

      {/* Overlay for text readability */}
      <div className='absolute inset-0 bg-black/30' style={{ zIndex: 2 }} />

      <div
        className='relative container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-32'
        style={{ zIndex: 3 }}
      >
        <div className='max-w-4xl mx-auto text-center'>
          {/* Logo / Name */}
          <div className='mb-6 sm:mb-8'>
            <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4'>
              <span className='text-white drop-shadow-lg'>
                {siteConfig.siteName}
              </span>
            </h1>
            <div className='h-[2px] w-16 sm:w-24 bg-white mx-auto opacity-80' />
          </div>

          {/* Tagline */}
          <h2 className='text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-6 sm:mb-8 px-4'>
            {homeConfig.tagline[currentLang]}
          </h2>

          {/* Short Bio */}
          <p className='text-base sm:text-lg md:text-xl text-white/90 drop-shadow leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-2'>
            {homeConfig.shortBio[currentLang]}
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4'>
            <button
              onClick={() => navigate(getLocalizedPath('/search'))}
              className='inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto text-sm sm:text-base'
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
            </button>

            <button
              onClick={scrollToContact}
              className='inline-flex items-center justify-center gap-2 border-2 border-white hover:bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all w-full sm:w-auto backdrop-blur-sm text-sm sm:text-base'
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
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
