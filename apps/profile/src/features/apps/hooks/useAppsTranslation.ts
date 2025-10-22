import { createFeatureTranslation } from '@nx-playground/i18n';

export const useAppsTranslation = createFeatureTranslation('apps', [
  'title',
  'subtitle',
  'searchPlaceholder',
  'noResults',
  'stats.applications',
  'stats.frameworks',
  'stats.technologies',
  'stats.typescript',
]);
