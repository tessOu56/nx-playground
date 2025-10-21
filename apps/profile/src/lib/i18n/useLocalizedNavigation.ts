import { useTranslation } from '@nx-playground/i18n';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { type SupportedLocale } from './LocaleRouter';

/**
 * Hook for locale-aware navigation
 * Ensures all navigation includes the current locale prefix
 */
export function useLocalizedNavigation() {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLocale = (locale ?? i18n.language ?? 'zh-TW') as SupportedLocale;

  /**
   * Navigate to a path with locale prefix
   */
  const localizedNavigate = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      navigate(`/${currentLocale}/${cleanPath}`);
    },
    [currentLocale, navigate]
  );

  /**
   * Change language and update URL
   */
  const changeLanguage = useCallback(
    (newLocale: SupportedLocale) => {
      // Get current path without locale
      const currentPath =
        window.location.pathname.replace(`/${currentLocale}`, '') || '/';

      // Change i18n language
      i18n.changeLanguage(newLocale);

      // Navigate to new locale path
      navigate(`/${newLocale}${currentPath}`);
    },
    [currentLocale, i18n, navigate]
  );

  /**
   * Get localized path for a given path
   */
  const getLocalizedPath = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return `/${currentLocale}/${cleanPath}`;
    },
    [currentLocale]
  );

  return {
    locale: currentLocale,
    navigate: localizedNavigate,
    changeLanguage,
    getLocalizedPath,
  };
}
