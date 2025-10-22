import { Button } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { type SupportedLocale } from '../../lib/i18n';

export const LanguageSwitcher: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentLocale = (): SupportedLocale => {
    const match = location.pathname.match(/^\/(zh-TW|en)/);
    return (match?.[1] as SupportedLocale) ?? 'en';
  };

  const switchLanguage = (newLocale: SupportedLocale) => {
    const currentLocale = getCurrentLocale();
    const newPath = location.pathname.replace(
      new RegExp(`^/${currentLocale}`),
      `/${newLocale}`
    );
    navigate(newPath);
  };

  const locale = getCurrentLocale();

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
          onClick={() => switchLanguage(lang.code)}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

