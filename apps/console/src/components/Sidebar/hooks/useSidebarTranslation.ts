import { createFeatureTranslation } from '@nx-playground/i18n';

export const useSidebarTranslation = createFeatureTranslation('sidebar', [
  'sidebar.title',
  'sidebar.navigation.dashboard',
  'sidebar.navigation.events',
  'sidebar.navigation.users',
  'sidebar.navigation.forms',
  'sidebar.navigation.components',
  'sidebar.navigation.settings',
]);
