import { createFeatureTranslation } from '@nx-playground/i18n';

/**
 * Detail feature translation hook
 *
 * @example
 * ```tsx
 * const { t } = useDetailTranslation();
 * <h1>{String(t('techStack'))}</h1>
 * ```
 */
export const useDetailTranslation = createFeatureTranslation('detail', [
  'backToApps',
  'backToLibs',
  'techStack',
  'keyFeatures',
  'highlights',
  'links',
  'viewDemo',
  'viewGitHub',
  'localDev',
  'comingSoon',
  'readme',
  'prd',
  'changelog',
  'latestRelease',
  'allReleases',
]);
