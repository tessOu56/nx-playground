import { useTranslations } from 'next-intl';

// Re-export next-intl hooks for convenience
export { useTranslations, useLocale, useMessages } from 'next-intl';

// Custom hook for common translations
export function useCommonTranslations() {
  const t = useTranslations('common');
  return t;
}

// Custom hook for UI translations
export function useUITranslations() {
  const t = useTranslations('ui');
  return t;
}

// Custom hook for events translations
export function useEventsTranslations() {
  const t = useTranslations('events');
  return t;
}

// Custom hook for forms translations
export function useFormsTranslations() {
  const t = useTranslations('forms');
  return t;
}
