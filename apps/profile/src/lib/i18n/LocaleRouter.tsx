import { useTranslation } from '@nx-playground/i18n';
import { type FC, type ReactNode, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface LocaleRouterProps {
  children: ReactNode;
}

const SUPPORTED_LOCALES = ['zh-TW', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * LocaleRouter 組件
 * 根據 URL 中的 locale 參數設置 i18n 語言
 */
export const LocaleRouter: FC<LocaleRouterProps> = ({ children }) => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && isSupportedLocale(locale) && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  // 如果 locale 無效，重定向到預設語言（en）
  if (locale && !isSupportedLocale(locale)) {
    return (
      <Navigate
        to={`/en${window.location.pathname.replace(`/${locale}`, '')}`}
        replace
      />
    );
  }

  return children;
};
