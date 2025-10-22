import { type FC } from 'react';

import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';

export const ExperienceTimeline: FC = () => {
  const { t, i18n } = useHomeTranslation();
  const currentLang = i18n.language as 'zh-TW' | 'en';

  return (
    <section className='container mx-auto px-4 py-16 md:py-20'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            {String(t('experience.title'))}
          </h2>
        </div>

        {/* Timeline */}
        <div className='relative'>
          {/* Vertical line */}
          <div className='absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary md:-ml-px' />

          {/* Timeline items */}
          <div className='space-y-12'>
            {homeConfig.experience.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Year marker (center) */}
                <div className='absolute left-8 md:left-1/2 md:-ml-12 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-white dark:bg-gray-800 border-4 border-primary rounded-full flex items-center justify-center shadow-lg z-10'>
                    <span className='text-sm font-bold text-primary'>
                      {exp.year}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 ml-24 md:ml-0 ${
                    index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'
                  }`}
                >
                  <div
                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow ${
                      index % 2 === 0
                        ? 'md:mr-0 md:ml-auto'
                        : 'md:ml-0 md:mr-auto'
                    }`}
                  >
                    {/* Title */}
                    <h3 className='text-xl font-semibold text-foreground mb-3'>
                      {exp.title[currentLang]}
                    </h3>

                    {/* Description */}
                    <p className='text-muted-foreground leading-relaxed'>
                      {exp.description[currentLang]}
                    </p>

                    {/* Decorative dot */}
                    <div
                      className={`absolute top-6 ${
                        index % 2 === 0
                          ? 'md:right-0 md:-mr-2'
                          : 'md:left-0 md:-ml-2'
                      } hidden md:block`}
                    >
                      <div className='w-4 h-4 bg-primary rounded-full' />
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className='flex-1 hidden md:block' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

