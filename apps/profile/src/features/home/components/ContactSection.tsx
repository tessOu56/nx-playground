import { type FC, useState, useEffect } from 'react';

import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';
import './ContactSection.css';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export const ContactSection: FC = () => {
  const { t } = useHomeTranslation();
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate snowflakes on client-side only (avoid SSR/CSR mismatch)
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div
      id='contact-section'
      className='h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden'
      data-header-dark='true'
    >
      {/* Snowfall Effect */}
      <div className='absolute inset-0 snowfall-container' aria-hidden='true'>
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className='snowflake'
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className='relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 drop-shadow-2xl'>
          {String(t('contact.title'))}
        </h2>
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 drop-shadow-lg'>
          {String(t('contact.subtitle'))}
        </p>

        {/* Email Button */}
        <a
          href={`mailto:${homeConfig.contact.email}`}
          className='inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-6 bg-white text-blue-600 rounded-2xl text-base sm:text-lg md:text-xl font-semibold hover:bg-gray-100 motion-safe:transition-all shadow-2xl motion-safe:hover:shadow-3xl motion-safe:hover:scale-105'
          aria-label={`Send email to ${homeConfig.contact.email}`}
        >
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8'
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
          <span>{String(t('contact.sendEmail'))}</span>
        </a>

        <p className='mt-6 sm:mt-8 text-white/80 text-sm sm:text-base md:text-lg drop-shadow'>
          {homeConfig.contact.email}
        </p>
      </div>
    </div>
  );
};
