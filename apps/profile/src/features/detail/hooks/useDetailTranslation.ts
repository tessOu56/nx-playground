import { useTranslation } from '@nx-playground/i18n';

import type enDetail from '../locales/en/detail.json';

type DetailTranslationKey = keyof typeof enDetail;

/**
 * Detail feature translation hook
 *
 * @example
 * ```tsx
 * const { t } = useDetailTranslation();
 * <h1>{t('techStack')}</h1>
 * ```
 */
export function useDetailTranslation() {
  const { t: translate, i18n } = useTranslation('detail');

  const t = (key: DetailTranslationKey) => translate(key);

  return {
    t,
    i18n,
  };
}
