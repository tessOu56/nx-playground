// CSS imports are handled separately to avoid TypeScript compilation issues
// The CSS files are imported by the consuming applications

// 重新導出 Vanilla Extract 常用功能
export { createGlobalTheme, createTheme, style } from '@vanilla-extract/css';

// 重新導出 TypeScript 定義
export * from './tokens/generated/design-tokens.d';

// 設計系統類型定義
export interface DesignSystemTokens {
  colors: {
    base: Record<string, string>;
    gray: Record<string, string>;
    brand: Record<string, string>;
    error: Record<string, string>;
    warning: Record<string, string>;
    success: Record<string, string>;
    green: Record<string, string>;
    blue: Record<string, string>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontWeight: Record<string, string>;
    fontSize: Record<string, string>;
    lineHeight: Record<string, string>;
  };
}

// 語義化設計 Token 類型
export interface SemanticTokens {
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    error: string;
    warning: string;
    success: string;
    brand: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    brand: string;
    error: string;
    warning: string;
    success: string;
  };
  border: {
    primary: string;
    secondary: string;
    disabled: string;
    error: string;
    brand: string;
  };
}

// 主題系統
export * from './theme';
