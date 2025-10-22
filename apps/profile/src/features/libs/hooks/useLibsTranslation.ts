import { createFeatureTranslation } from '@nx-playground/i18n';

export const useLibsTranslation = createFeatureTranslation('libs', [
  'title',
  'subtitle',
  'searchPlaceholder',
  'noResults',
  'categories.ui',
  'categories.data',
  'categories.utils',
  'monorepoTitle',
  'monorepoSubtitle',
  'stats.libraries',
  'stats.applications',
  'stats.typescript',
  'stats.reusable',
] as const);
