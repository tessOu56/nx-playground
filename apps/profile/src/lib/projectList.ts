/**
 * 硬編碼的專案列表
 * 由於 Vite glob 無法跨越專案 root，我們手動維護專案列表
 * 
 * 注意：id 使用數字前綴系統來控制排序順序
 * - 01-xx: 主要展示專案
 * - 02-xx: 重要功能專案
 * - 其他: 按字母排序
 */

export const APP_IDS = [
  '01-profile',
  '02-event-cms',
  '03-event-portal',
  '04-auth',
  'api-server',
  'enterprise-admin',
  'vue-motion',
] as const;

export const LIB_IDS = [
  '01-ui-components',
  '02-design-system',
  '03-i18n',
  '04-hooks',
  'animation-data',
  'api-client',
  'auth-client',
  'charts',
  'enterprise-data',
  'search-engine',
  'tech-stack-data',
] as const;

export type AppId = (typeof APP_IDS)[number];
export type LibId = (typeof LIB_IDS)[number];

/**
 * ID 對應實體目錄名稱
 * 顯示用 id (有數字前綴) → 實體目錄名稱 (無前綴)
 */
export const ID_TO_DIR_MAP: Record<string, string> = {
  // Apps
  '01-profile': 'profile',
  '02-event-cms': 'event-cms',
  '03-event-portal': 'event-portal',
  '04-auth': 'auth',
  'api-server': 'api-server',
  'enterprise-admin': 'enterprise-admin',
  'vue-motion': 'vue-motion',
  
  // Libs
  '01-ui-components': 'ui-components',
  '02-design-system': 'design-system',
  '03-i18n': 'i18n',
  '04-hooks': 'hooks',
  'animation-data': 'animation-data',
  'api-client': 'api-client',
  'auth-client': 'auth-client',
  'charts': 'charts',
  'enterprise-data': 'enterprise-data',
  'search-engine': 'search-engine',
  'tech-stack-data': 'tech-stack-data',
};

/**
 * 將顯示用 id 轉換為實體目錄名稱
 */
export function idToDir(id: string): string {
  return ID_TO_DIR_MAP[id] || id;
}

