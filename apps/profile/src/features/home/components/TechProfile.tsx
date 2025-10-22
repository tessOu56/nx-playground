import { type FC, useEffect, useState } from 'react';
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
  const [headerDark, setHeaderDark] = useState(false);

  // Monitor header dark mode state
  useEffect(() => {
    const checkHeaderDark = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const isDark =
          nav.classList.contains('bg-gray-900') ||
          nav.style.backgroundColor?.includes('gray-900');
        setHeaderDark(isDark);
      }
    };

    // Check initially
    checkHeaderDark();

    // Monitor for changes
    const observer = new MutationObserver(checkHeaderDark);
    const nav = document.querySelector('nav');
    if (nav) {
      observer.observe(nav, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    }

    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      className='relative overflow-hidden min-h-screen flex items-center'
      data-header-dark='true'
      style={{
        paddingTop: headerDark ? '50px' : '0px',
        minHeight: headerDark ? '100vh' : 'calc(100vh - 50px)',
      }}
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
        className='relative container mx-auto px-4 py-20 md:py-32'
        style={{ zIndex: 3 }}
      >
        <div className='max-w-4xl mx-auto text-center'>
          {/* Logo / Name */}
          <div className='mb-8'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-4'>
              <span className='text-white drop-shadow-lg'>
                {siteConfig.siteName}
              </span>
            </h1>
            <div className='h-[2px] w-24 bg-white mx-auto opacity-80' />
          </div>

          {/* Tagline */}
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-8'>
            {homeConfig.tagline[currentLang]}
          </h2>

          {/* Short Bio */}
          <p className='text-lg md:text-xl text-white/90 drop-shadow leading-relaxed max-w-2xl mx-auto mb-12'>
            {homeConfig.shortBio[currentLang]}
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button
              onClick={() => navigate(getLocalizedPath('/search'))}
              className='inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto'
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
              className='inline-flex items-center justify-center gap-2 border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-medium transition-all w-full sm:w-auto backdrop-blur-sm'
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
