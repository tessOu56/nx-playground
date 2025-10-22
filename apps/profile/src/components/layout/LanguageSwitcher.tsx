import { Button } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { type SupportedLocale } from '../lib/i18n';
import { useLocalizedNavigation } from '../lib/i18n/useLocalizedNavigation';

export const LanguageSwitcher: FC = () => {
  const { locale, changeLanguage } = useLocalizedNavigation();

  const languages: { code: SupportedLocale; label: string }[] = [
    { code: 'zh-TW', label: '繁中' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className='flex items-center gap-2'>
      {languages.map(lang => (
        <Button
          key={lang.code}
          variant={locale === lang.code ? 'default' : 'ghost'}
          size='sm'
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

