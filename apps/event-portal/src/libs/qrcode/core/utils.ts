import type { QRCodeTheme, QRCodeThemeColors } from './types';

/**
 * 根據主題獲取顏色配置
 */
export function getThemeColors(theme: QRCodeTheme): QRCodeThemeColors {
  switch (theme) {
    case 'order':
      return {
        dots: '#1f2937', // 深灰色
        background: '#ffffff', // 白色
        corners: '#3b82f6', // 藍色
      };
    case 'checkin':
      return {
        dots: '#059669', // 綠色
        background: '#ffffff', // 白色
        corners: '#10b981', // 淺綠色
      };
    default:
      return {
        dots: '#000000',
        background: '#ffffff',
        corners: '#6b7280',
      };
  }
}
