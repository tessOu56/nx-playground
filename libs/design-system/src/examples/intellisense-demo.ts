/**
 * IntelliSense 演示
 *
 * 這個檔案展示如何在 VS Code 中使用設計 tokens 的 IntelliSense 功能
 *
 * 使用方法：
 * 1. 在 VS Code 中打開這個檔案
 * 2. 將游標放在下面的函數中
 * 3. 開始輸入，你會看到自動完成和實際數值提示
 */

import type {
  BlueColors,
  BorderRadius,
  GrayColors,
  SemanticColors,
  Spacing,
  ThemeType,
} from '../index';

// 演示 1: 顏色 IntelliSense
function demonstrateColorIntelliSense() {
  // 將游標放在這裡並輸入 BlueColors['500']
  // 你會看到提示顯示 '#2e90fa'
  const primaryBlue: BlueColors['500'] = '#2e90fa';

  // 將游標放在這裡並輸入 GrayColors['900']
  // 你會看到提示顯示 '#13161b'
  const darkGray: GrayColors['900'] = '#13161b';

  return { primaryBlue, darkGray };
}

// 演示 2: 間距 IntelliSense
function demonstrateSpacingIntelliSense() {
  // 將游標放在這裡並輸入 Spacing['4']
  // 你會看到提示顯示 '16px'
  const padding: Spacing['4'] = '16px';

  // 將游標放在這裡並輸入 Spacing['0․5']
  // 你會看到提示顯示 '2px'
  const smallGap: Spacing['0․5'] = '2px';

  return { padding, smallGap };
}

// 演示 3: 圓角 IntelliSense
function demonstrateRadiusIntelliSense() {
  // 將游標放在這裡並輸入 BorderRadius['md']
  // 你會看到提示顯示 '8px'
  const borderRadius: BorderRadius['md'] = '8px';

  // 將游標放在這裡並輸入 BorderRadius['full']
  // 你會看到提示顯示 '9999px'
  const rounded: BorderRadius['full'] = '9999px';

  return { borderRadius, rounded };
}

// 演示 4: 語義化顏色 IntelliSense
function demonstrateSemanticIntelliSense() {
  // 將游標放在這裡並輸入 SemanticColors['text']['primary']
  // 你會看到提示顯示 'var(--color-text-primary)'
  const textColor: SemanticColors['text']['primary'] =
    'var(--color-text-primary)';

  // 將游標放在這裡並輸入 SemanticColors['background']['secondary']
  // 你會看到提示顯示 'var(--color-background-secondary)'
  const bgColor: SemanticColors['background']['secondary'] =
    'var(--color-background-secondary)';

  return { textColor, bgColor };
}

// 演示 5: 主題類型 IntelliSense
function demonstrateThemeIntelliSense(_theme: ThemeType = 'base') {
  // 將游標放在這裡並輸入 ThemeType
  // 你會看到提示顯示 'base' | 'enterprise' | 'monochrome'

  // 在 switch 語句中，TypeScript 會確保所有情況都被處理
  switch (_theme) {
    case 'base':
      return '基礎設計系統';
    case 'enterprise':
      return '企業版設計系統';
    case 'monochrome':
      return '黑白灰色調設計系統';
    default:
      return '未知主題';
  }
}

// 演示 6: 在 React 組件中使用
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  size: keyof Spacing;
  borderRadius: keyof BorderRadius;
}

function Button({
  variant,
  size: _size,
  borderRadius: _borderRadius,
}: ButtonProps) {
  // 使用具體的顏色類型
  const primaryColor: BlueColors['500'] = '#2e90fa';
  const errorColor: SemanticColors['border']['error'] =
    'var(--color-border-error)';

  // 使用間距和圓角類型
  const padding: Spacing[typeof _size] = '16px' as Spacing[typeof _size];
  const radius: BorderRadius[typeof _borderRadius] =
    '8px' as BorderRadius[typeof _borderRadius];

  return {
    backgroundColor: variant === 'primary' ? primaryColor : errorColor,
    padding,
    borderRadius: radius,
  };
}

// 演示 7: 動態主題切換
function createThemeConfig(theme: ThemeType) {
  switch (theme) {
    case 'base':
      return {
        primaryColor: 'blue' as const,
        // 使用具體的藍色值
        primaryBlue: '#2e90fa' as BlueColors['500'],
      };
    case 'enterprise':
      return {
        primaryColor: 'gray-blue' as const,
        // 使用具體的灰色值
        primaryGray: '#4e5ba6' as GrayColors['blue-500'],
      };
    case 'monochrome':
      return {
        primaryColor: 'gray' as const,
        // 使用具體的灰色值
        primaryGray: '#85888e' as GrayColors['500'],
      };
  }
}

export {
  Button,
  createThemeConfig,
  demonstrateColorIntelliSense,
  demonstrateRadiusIntelliSense,
  demonstrateSemanticIntelliSense,
  demonstrateSpacingIntelliSense,
  demonstrateThemeIntelliSense,
};
