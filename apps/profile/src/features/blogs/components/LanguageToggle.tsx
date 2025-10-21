/**
 * Language toggle component for blog posts
 */

import { Button } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useBlogTranslation } from '../hooks/useBlogTranslation';

interface LanguageToggleProps {
  currentSlug: string;
}

export const LanguageToggle: FC<LanguageToggleProps> = ({ currentSlug }) => {
  const { locale, changeLanguage } = useLocalizedNavigation();
  const { t } = useBlogTranslation();

  const handleToggle = () => {
    const newLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';
    changeLanguage(newLocale);
    // URL will automatically update to /:newLocale/blog/:slug
  };

  const targetLang = locale === 'zh-TW' ? 'en' : 'zh-TW';
  const targetLangLabel = t(`language.${targetLang}`);

  return (
    <Button variant='outline' size='sm' onClick={handleToggle}>
      {targetLangLabel}
    </Button>
  );
};


