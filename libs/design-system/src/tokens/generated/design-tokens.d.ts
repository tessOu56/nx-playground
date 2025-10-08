/**
 * Design Tokens TypeScript Definitions
 * 
 * 這個檔案提供設計 tokens 的完整 TypeScript 支援，
 * 包括 IntelliSense 自動完成和實際數值顯示。
 */

// 基礎顏色定義
export interface BaseColors {
  white: '#ffffff';
  black: '#000000';
  transparent: 'rgba(255, 255, 255, 0)';
}

// 灰色系定義
export interface GrayColors {
  '25': '#fafafa';
  '50': '#f7f7f7';
  '100': '#f0f0f1';
  '200': '#ececed';
  '300': '#cecfd2';
  '400': '#94979c';
  '500': '#85888e';
  '600': '#61656c';
  '700': '#373a41';
  '800': '#22262f';
  '900': '#13161b';
  '950': '#0c0e12';
  'blue-25': '#fcfcfd';
  'cool-25': '#fcfcfd';
  'modern-25': '#fcfcfd';
  'neutral-25': '#fcfcfd';
  'neutral-50': '#f9fafb';
  'blue-50': '#f8f9fc';
  'blue-100': '#eaecf5';
  'blue-200': '#d5d9eb';
  'blue-300': '#b3b8db';
  'blue-400': '#717bbc';
  'blue-500': '#4e5ba6';
  'blue-600': '#3e4784';
  'blue-700': '#363f72';
  'blue-800': '#293056';
  'blue-900': '#101323';
  'blue-950': '#0d0f1c';
  'cool-50': '#f9f9fb';
  'cool-100': '#eff1f5';
  'cool-200': '#dcdfea';
  'cool-300': '#b9c0d4';
  'cool-400': '#7d89b0';
  'cool-500': '#5d6b98';
  'cool-600': '#4a5578';
  'cool-700': '#404968';
  'cool-800': '#30374f';
  'cool-900': '#111322';
  'modern-50': '#f8fafc';
  'modern-100': '#eef2f6';
  'modern-200': '#e3e8ef';
  'modern-300': '#cdd5df';
  'modern-400': '#9aa4b2';
  'modern-500': '#697586';
  'modern-600': '#4b5565';
  'modern-700': '#364152';
  'modern-800': '#202939';
  'modern-900': '#121926';
  'neutral-100': '#f3f4f6';
  'neutral-200': '#e5e7eb';
  'neutral-300': '#d2d6db';
  'neutral-400': '#9da4ae';
  'neutral-500': '#6c737f';
  'neutral-600': '#4d5761';
  'neutral-700': '#384250';
  'neutral-800': '#1f2a37';
  'neutral-900': '#111927';
  'iron-25': '#fcfcfc';
  'true-25': '#fcfcfc';
  'iron-50': '#fafafa';
  'true-50': '#f7f7f7';
  'iron-100': '#f4f4f5';
  'iron-200': '#e4e4e7';
  'iron-300': '#d1d1d6';
  'iron-400': '#a0a0ab';
  'iron-500': '#70707b';
  'iron-600': '#51525c';
  'iron-700': '#3f3f46';
  'iron-800': '#26272b';
  'iron-900': '#1a1a1e';
  'true-100': '#f5f5f5';
  'true-200': '#e5e5e5';
  'true-300': '#d6d6d6';
  'true-400': '#a3a3a3';
  'true-500': '#737373';
  'true-600': '#525252';
  'true-700': '#424242';
  'warm-25': '#fdfdfc';
  'warm-50': '#fafaf9';
  'warm-100': '#f5f5f4';
  'warm-200': '#e7e5e4';
  'warm-300': '#d7d3d0';
  'warm-400': '#a9a29d';
  'warm-500': '#79716b';
  'warm-600': '#57534e';
  'warm-700': '#44403c';
  'warm-800': '#292524';
  'warm-900': '#1c1917';
  'warm-950': '#171412';
  'cool-950': '#0e101b';
  'modern-950': '#0d121c';
  'neutral-950': '#0d121c';
  'iron-950': '#131316';
  'true-800': '#292929';
  'true-900': '#141414';
  'true-950': '#0f0f0f';
}

// 品牌顏色定義
export interface BrandColors {
  '25': '#fcfaff';
  '50': '#f9f5ff';
  '100': '#f4ebff';
  '200': '#e9d7fe';
  '300': '#d6bbfb';
  '400': '#b692f6';
  '500': '#9e77ed';
  '600': '#7f56d9';
  '700': '#6941c6';
  '800': '#53389e';
  '900': '#42307d';
  '950': '#2c1c5f';
}

// 錯誤顏色定義
export interface ErrorColors {
  '25': '#fffbfa';
  '50': '#fef3f2';
  '100': '#fee4e2';
  '200': '#fecdca';
  '300': '#fda29b';
  '400': '#f97066';
  '500': '#f04438';
  '600': '#d92d20';
  '700': '#b42318';
  '800': '#912018';
  '900': '#7a271a';
  '950': '#55160c';
}

// 警告顏色定義
export interface WarningColors {
  '25': '#fffcf5';
  '50': '#fffaeb';
  '100': '#fef0c7';
  '200': '#fedf89';
  '300': '#fec84b';
  '400': '#fdb022';
  '500': '#f79009';
  '600': '#dc6803';
  '700': '#b54708';
  '800': '#93370d';
  '900': '#7a2e0e';
  '950': '#4e1d09';
}

// 成功顏色定義
export interface SuccessColors {
  '25': '#f6fef9';
  '50': '#ecfdf3';
  '100': '#dcfae6';
  '200': '#abefc6';
  '300': '#75e0a7';
  '400': '#47cd89';
  '500': '#17b26a';
  '600': '#079455';
  '700': '#067647';
  '800': '#085d3a';
  '900': '#074d31';
  '950': '#053321';
}

// 綠色定義
export interface GreenColors {
  '25': '#f6fef9';
  '50': '#edfcf2';
  '100': '#d3f8df';
  '200': '#aaf0c4';
  '300': '#73e2a3';
  '400': '#3ccb7f';
  '500': '#16b364';
  '600': '#099250';
  '700': '#087443';
  '800': '#095c37';
  '900': '#084c2e';
  '950': '#052e1c';
  'light': '#15290a';
}

// 藍色定義
export interface BlueColors {
  '25': '#f5faff';
  '50': '#eff8ff';
  '100': '#d1e9ff';
  '200': '#b2ddff';
  '300': '#84caff';
  '400': '#53b1fd';
  '500': '#2e90fa';
  '600': '#1570ef';
  '700': '#175cd3';
  '800': '#1849a9';
  '900': '#194185';
  '950': '#102a56';
  'light': '#062c41';
  'dark': '#002266';
}

// 間距定義
export interface Spacing {
  '0': '0px';
  '1': '4px';
  '2': '8px';
  '3': '12px';
  '4': '16px';
  '5': '20px';
  '6': '24px';
  '8': '32px';
  '10': '40px';
  '12': '48px';
  '16': '64px';
  '20': '80px';
  '24': '96px';
  '32': '128px';
  '40': '160px';
  '48': '192px';
  '56': '224px';
  '64': '256px';
  '80': '320px';
  '96': '384px';
  '120': '480px';
  '140': '560px';
  '160': '640px';
  '180': '720px';
  '192': '768px';
  '256': '1024px';
  '320': '1280px';
  '360': '1440px';
  '400': '1600px';
  '480': '1920px';
  '0․5': '2px';
  '1․5': '6px';
}

// 圓角定義
export interface BorderRadius {
  'none': '0px';
  'xxs': '2px';
  'xs': '4px';
  'sm': '6px';
  'md': '8px';
  'xl': '12px';
  '2xl': '16px';
  '4xl': '24px';
  'full': '9999px';
  'lg': '10px';
  '3xl': '20px';
}

// 字體大小定義
export interface FontSize {
  'xs': '12px';
  'sm': '14px';
  'base': '16px';
  'lg': '18px';
  'xl': '20px';
  '2xl': '24px';
  '3xl': '30px';
  '4xl': '36px';
  '5xl': '48px';
  '6xl': '60px';
  '7xl': '72px';
  '8xl': '96px';
  '9xl': '128px';
}

// 字重定義
export interface FontWeight {
  'thin': '100';
  'extralight': '200';
  'light': '300';
  'normal': '400';
  'medium': '500';
  'semibold': '600';
  'bold': '700';
  'extrabold': '800';
  'black': '900';
}

// 行高定義
export interface LineHeight {
  'none': '1';
  'tight': '1.25';
  'snug': '1.375';
  'normal': '1.5';
  'relaxed': '1.625';
  'loose': '2';
  '3': '0.75rem';
  '4': '1rem';
  '5': '1.25rem';
  '6': '1.5rem';
  '7': '1.75rem';
  '8': '2rem';
  '9': '2.25rem';
  '10': '2.5rem';
}

// 語義化顏色定義
export interface SemanticColors {
  text: {
    primary: 'var(--color-text-primary)';
    secondary: 'var(--color-text-secondary)';
    tertiary: 'var(--color-text-tertiary)';
    disabled: 'var(--color-text-disabled)';
    inverse: 'var(--color-text-inverse)';
  };
  background: {
    primary: 'var(--color-background-primary)';
    secondary: 'var(--color-background-secondary)';
    tertiary: 'var(--color-background-tertiary)';
    inverse: 'var(--color-background-inverse)';
  };
  border: {
    primary: 'var(--color-border-primary)';
    secondary: 'var(--color-border-secondary)';
    focus: 'var(--color-border-focus)';
    error: 'var(--color-border-error)';
    success: 'var(--color-border-success)';
    warning: 'var(--color-border-warning)';
  };
}

// 主要顏色定義
export interface PrimaryColors {
  '25': 'var(--color-primary-25)';
  '50': 'var(--color-primary-50)';
  '100': 'var(--color-primary-100)';
  '200': 'var(--color-primary-200)';
  '300': 'var(--color-primary-300)';
  '400': 'var(--color-primary-400)';
  '500': 'var(--color-primary-500)';
  '600': 'var(--color-primary-600)';
  '700': 'var(--color-primary-700)';
  '800': 'var(--color-primary-800)';
  '900': 'var(--color-primary-900)';
  '950': 'var(--color-primary-950)';
}

// 次要顏色定義
export interface SecondaryColors {
  '25': 'var(--color-secondary-25)';
  '50': 'var(--color-secondary-50)';
  '100': 'var(--color-secondary-100)';
  '200': 'var(--color-secondary-200)';
  '300': 'var(--color-secondary-300)';
  '400': 'var(--color-secondary-400)';
  '500': 'var(--color-secondary-500)';
  '600': 'var(--color-secondary-600)';
  '700': 'var(--color-secondary-700)';
  '800': 'var(--color-secondary-800)';
  '900': 'var(--color-secondary-900)';
  '950': 'var(--color-secondary-950)';
}

// 完整的設計 tokens 定義
export interface DesignTokens {
  colors: {
    base: BaseColors;
    gray: GrayColors;
    brand: BrandColors;
    error: ErrorColors;
    warning: WarningColors;
    success: SuccessColors;
    green: GreenColors;
    blue: BlueColors;
    primary: PrimaryColors;
    secondary: SecondaryColors;
  };
  spacing: Spacing;
  radius: BorderRadius;
  typography: {
    fontSize: FontSize;
    fontWeight: FontWeight;
    lineHeight: LineHeight;
  };
  semantic: SemanticColors;
}

// 主題類型定義
export type ThemeType = 'base' | 'enterprise' | 'monochrome';

// 主題配置定義
export interface ThemeConfig {
  name: ThemeType;
  displayName: string;
  description: string;
  selector: string;
  primaryColor: string;
}
