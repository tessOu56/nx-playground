/**
 * 硬編碼的專案列表
 * 由於 Vite glob 無法跨越專案 root，我們手動維護專案列表
 */

export const APP_IDS = [
  'api-server',
  'auth',
  'enterprise-admin',
  'event-cms',
  'event-portal',
  'profile',
  'vue-motion',
] as const;

export const LIB_IDS = [
  'animation-data',
  'api-client',
  'auth-client',
  'charts',
  'design-system',
  'enterprise-data',
  'hooks',
  'i18n',
  'tech-stack-data',
  'ui-components',
] as const;

export type AppId = (typeof APP_IDS)[number];
export type LibId = (typeof LIB_IDS)[number];

