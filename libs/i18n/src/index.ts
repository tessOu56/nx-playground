// Legacy react-i18next exports (deprecated for App Router)
export {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES,
  default as i18n,
  type SupportedLanguage,
} from './lib/i18n';

// SSR-friendly i18n configuration (deprecated for App Router)
export { initI18n } from './lib/i18nSSR';

// Legacy Provider and hooks (deprecated for App Router)
export {
  I18nProvider,
  I18nProviderSmart, // 向後兼容別名
  useI18nSmart,
  useI18nSmartContext,
} from './lib/useI18nSmart';
export { useTranslation } from './lib/useTranslation';
export { useUITranslation } from './lib/useUITranslation';

// Legacy Feature i18n utilities (deprecated for App Router)
export { createFeatureI18n } from './lib/createFeatureI18n';
export { createFeatureTranslation } from './lib/createFeatureTranslation';

// Next-intl exports (recommended for App Router)
export * from './lib/next-intl';
