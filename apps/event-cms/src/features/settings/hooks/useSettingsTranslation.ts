import { createFeatureTranslation } from '@nx-playground/i18n';

export const useSettingsTranslation = createFeatureTranslation('settings', [
  'settings.title',
  'settings.description',
  'settings.appearance.title',
  'settings.appearance.theme.title',
  'settings.appearance.theme.description',
  'settings.appearance.colorMode.title',
  'settings.appearance.colorMode.description',
  'settings.appearance.language.title',
  'settings.appearance.language.description',
]);
