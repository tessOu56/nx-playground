/**
 * TypeScript 使用示例
 *
 * 這個檔案展示如何在 TypeScript 中使用設計 tokens 的類型定義
 */

import type {
  BlueColors,
  BorderRadius,
  DesignTokens,
  GrayColors,
  SemanticColors,
  Spacing,
  ThemeType,
} from '../index';

// 示例 1: 使用具體的顏色類型
function createButtonStyles(): BlueColors['500'] {
  return '#2e90fa'; // TypeScript 會檢查這個值是否正確
}

// 示例 2: 使用間距類型
function getSpacingValue(size: keyof Spacing): string {
  const spacing: Spacing = {
    '0': '0px',
    '0․5': '2px',
    '1': '4px',
    '1․5': '6px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
    '32': '128px',
    '40': '160px',
    '48': '192px',
    '56': '224px',
    '64': '256px',
    '80': '320px',
    '96': '384px',
    '120': '480px',
    '140': '560px',
    '160': '640px',
    '180': '720px',
    '192': '768px',
    '256': '1024px',
    '320': '1280px',
    '360': '1440px',
    '400': '1600px',
    '480': '1920px',
  };
  return spacing[size];
}

// 示例 3: 使用圓角類型
function getBorderRadius(size: keyof BorderRadius): string {
  const radius: BorderRadius = {
    none: '0px',
    xxs: '2px',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '20px',
    '4xl': '24px',
    full: '9999px',
  };
  return radius[size];
}

// 示例 4: 使用語義化顏色
function getSemanticColors(): SemanticColors {
  return {
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      tertiary: 'var(--color-text-tertiary)',
      disabled: 'var(--color-text-disabled)',
      inverse: 'var(--color-text-inverse)',
    },
    background: {
      primary: 'var(--color-background-primary)',
      secondary: 'var(--color-background-secondary)',
      tertiary: 'var(--color-background-tertiary)',
      inverse: 'var(--color-background-inverse)',
    },
    border: {
      primary: 'var(--color-border-primary)',
      secondary: 'var(--color-border-secondary)',
      focus: 'var(--color-border-focus)',
      error: 'var(--color-border-error)',
      success: 'var(--color-border-success)',
      warning: 'var(--color-border-warning)',
    },
  };
}

// 示例 5: 主題類型檢查
function setTheme(theme: ThemeType): void {
  console.log(`Setting theme to: ${theme}`);
  // TypeScript 會確保 theme 只能是 'base' | 'enterprise' | 'monochrome'
}

// 示例 6: 完整的設計 tokens 使用
function createDesignSystem(): DesignTokens {
  return {
    colors: {
      base: {
        white: '#ffffff',
        black: '#000000',
        transparent: 'rgba(255, 255, 255, 0)',
      },
      gray: {
        '25': '#fafafa',
        '50': '#f7f7f7',
        '100': '#f0f0f1',
        '200': '#ececed',
        '300': '#cecfd2',
        '400': '#94979c',
        '500': '#85888e',
        '600': '#61656c',
        '700': '#373a41',
        '800': '#22262f',
        '900': '#13161b',
        '950': '#0c0e12',
      } as GrayColors,
      brand: {
        '25': '#fcfaff',
        '50': '#f9f5ff',
        '100': '#f4ebff',
        '200': '#e9d7fe',
        '300': '#d6bbfb',
        '400': '#b692f6',
        '500': '#9e77ed',
        '600': '#7f56d9',
        '700': '#6941c6',
        '800': '#53389e',
        '900': '#42307d',
        '950': '#2c1c5f',
      },
      error: {
        '25': '#fffbfa',
        '50': '#fef3f2',
        '100': '#fee4e2',
        '200': '#fecdca',
        '300': '#fda29b',
        '400': '#f97066',
        '500': '#f04438',
        '600': '#d92d20',
        '700': '#b42318',
        '800': '#912018',
        '900': '#7a271a',
        '950': '#55160c',
      },
      warning: {
        '25': '#fffcf5',
        '50': '#fffaeb',
        '100': '#fef0c7',
        '200': '#fedf89',
        '300': '#fec84b',
        '400': '#fdb022',
        '500': '#f79009',
        '600': '#dc6803',
        '700': '#b54708',
        '800': '#93370d',
        '900': '#7a2e0e',
        '950': '#4e1d09',
      },
      success: {
        '25': '#f6fef9',
        '50': '#ecfdf3',
        '100': '#dcfae6',
        '200': '#abefc6',
        '300': '#75e0a7',
        '400': '#47cd89',
        '500': '#17b26a',
        '600': '#079455',
        '700': '#067647',
        '800': '#085d3a',
        '900': '#074d31',
        '950': '#053321',
      },
      green: {
        '25': '#f6fef9',
        '50': '#edfcf2',
        '100': '#d3f8df',
        '200': '#aaf0c4',
        '300': '#73e2a3',
        '400': '#3ccb7f',
        '500': '#16b364',
        '600': '#099250',
        '700': '#087443',
        '800': '#095c37',
        '900': '#084c2e',
        '950': '#052e1c',
        light: '#15290a',
      },
      blue: {
        '25': '#f5faff',
        '50': '#eff8ff',
        '100': '#d1e9ff',
        '200': '#b2ddff',
        '300': '#84caff',
        '400': '#53b1fd',
        '500': '#2e90fa',
        '600': '#1570ef',
        '700': '#175cd3',
        '800': '#1849a9',
        '900': '#194185',
        '950': '#102a56',
        light: '#062c41',
        dark: '#002266',
      } as BlueColors,
      primary: {
        '25': 'var(--color-primary-25)',
        '50': 'var(--color-primary-50)',
        '100': 'var(--color-primary-100)',
        '200': 'var(--color-primary-200)',
        '300': 'var(--color-primary-300)',
        '400': 'var(--color-primary-400)',
        '500': 'var(--color-primary-500)',
        '600': 'var(--color-primary-600)',
        '700': 'var(--color-primary-700)',
        '800': 'var(--color-primary-800)',
        '900': 'var(--color-primary-900)',
        '950': 'var(--color-primary-950)',
      },
      secondary: {
        '25': 'var(--color-secondary-25)',
        '50': 'var(--color-secondary-50)',
        '100': 'var(--color-secondary-100)',
        '200': 'var(--color-secondary-200)',
        '300': 'var(--color-secondary-300)',
        '400': 'var(--color-secondary-400)',
        '500': 'var(--color-secondary-500)',
        '600': 'var(--color-secondary-600)',
        '700': 'var(--color-secondary-700)',
        '800': 'var(--color-secondary-800)',
        '900': 'var(--color-secondary-900)',
        '950': 'var(--color-secondary-950)',
      },
    },
    spacing: {
      '0': '0px',
      '0․5': '2px',
      '1': '4px',
      '1․5': '6px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '8': '32px',
      '10': '40px',
      '12': '48px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '32': '128px',
      '40': '160px',
      '48': '192px',
      '56': '224px',
      '64': '256px',
      '80': '320px',
      '96': '384px',
      '120': '480px',
      '140': '560px',
      '160': '640px',
      '180': '720px',
      '192': '768px',
      '256': '1024px',
      '320': '1280px',
      '360': '1440px',
      '400': '1600px',
      '480': '1920px',
    } as Spacing,
    radius: {
      none: '0px',
      xxs: '2px',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '20px',
      '4xl': '24px',
      full: '9999px',
    } as BorderRadius,
    typography: {
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '60px',
        '7xl': '72px',
        '8xl': '96px',
        '9xl': '128px',
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
      },
    },
    semantic: getSemanticColors(),
  };
}

// 示例 7: 在 React 組件中使用
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  size: keyof Spacing;
  borderRadius: keyof BorderRadius;
}

function Button({ variant: _variant, size, borderRadius }: ButtonProps) {
  const primaryColor: BlueColors['500'] = '#2e90fa';
  const spacing = getSpacingValue(size);
  const radius = getBorderRadius(borderRadius);

  return {
    backgroundColor: primaryColor,
    padding: spacing,
    borderRadius: radius,
  };
}

// 示例 8: 使用主題類型
function createThemeConfig(theme: ThemeType) {
  switch (theme) {
    case 'base':
      return { primaryColor: 'blue' as const };
    case 'enterprise':
      return { primaryColor: 'gray-blue' as const };
    case 'monochrome':
      return { primaryColor: 'gray' as const };
    default:
      // TypeScript 會確保這裡不會有未處理的情況
      return { primaryColor: 'blue' as const };
  }
}

export {
  Button,
  createButtonStyles,
  createDesignSystem,
  createThemeConfig,
  getBorderRadius,
  getSemanticColors,
  getSpacingValue,
  setTheme,
};
