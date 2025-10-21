import { useTranslation } from '@nx-playground/i18n';
import { type FC } from 'react';

import { profileConfig } from '../../../data/profile.config';

export const TechProfile: FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'zh-TW' | 'en';

  return (
    <section className='container mx-auto px-4 py-20 md:py-28'>
      <div className='max-w-4xl mx-auto text-center'>
        {/* Logo / Name - Responsive */}
        <div className='mb-10'>
          <h1 className='text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6'>
            {profileConfig.name}
          </h1>
          <div className='h-[1px] w-32 bg-gradient-to-r from-primary to-secondary mx-auto' />
        </div>

        {/* Title */}
        <h2 className='text-3xl md:text-4xl font-semibold text-foreground mb-8'>
          {profileConfig.title[currentLang]}
        </h2>

        {/* Bio */}
        <p className='text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto'>
          {profileConfig.bio[currentLang]}
        </p>
      </div>
    </section>
  );
};
