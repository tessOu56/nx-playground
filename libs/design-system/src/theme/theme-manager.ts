// 主題管理器 - design-system 專用

export type ThemeManagerType = 'base' | 'enterprise' | 'monochrome';
export type ColorMode = 'light' | 'dark';

export interface ThemeManagerConfig {
  name: ThemeManagerType;
  displayName: string;
  description: string;
  selector: string;
  primaryColor: string;
}

export const availableThemes: Record<ThemeManagerType, ThemeManagerConfig> = {
  base: {
    name: 'base',
    displayName: '基礎設計系統',
    description: '使用藍灰色調的標準設計系統',
    selector: ':root',
    primaryColor: 'gray-blue',
  },
  enterprise: {
    name: 'enterprise',
    displayName: '企業版設計系統',
    description: '使用品牌色的專業企業級設計系統',
    selector: '[data-theme="enterprise"]',
    primaryColor: 'brand',
  },
  monochrome: {
    name: 'monochrome',
    displayName: '開發模式',
    description: '純灰色調，適合開發和調試',
    selector: '[data-theme="monochrome"]',
    primaryColor: 'gray',
  },
};

export class DynamicThemeManager {
  private _currentTheme: ThemeManagerType = 'base';
  private _currentColorMode: ColorMode = 'light';
  private _listeners: Set<
    (theme: ThemeManagerType, colorMode: ColorMode) => void
  > = new Set();

  constructor() {
    const savedTheme = this._getSavedTheme();
    const savedColorMode = this._getSavedColorMode();

    if (savedTheme && availableThemes[savedTheme]) {
      this._currentTheme = savedTheme;
    }

    if (savedColorMode) {
      this._currentColorMode = savedColorMode;
    }
  }

  getCurrentTheme(): ThemeManagerType {
    return this._currentTheme;
  }

  getCurrentColorMode(): ColorMode {
    return this._currentColorMode;
  }

  getCurrentThemeConfig(): ThemeManagerConfig {
    return availableThemes[this._currentTheme];
  }

  getAvailableThemes(): ThemeManagerConfig[] {
    return Object.values(availableThemes);
  }

  async setTheme(theme: ThemeManagerType): Promise<void> {
    if (!availableThemes[theme]) {
      console.warn(`Theme "${theme}" is not available`);
      return;
    }

    this._currentTheme = theme;
    this._saveTheme(theme);
    await this._applyTheme(theme);
    this._notifyListeners(theme, this._currentColorMode);
  }

  async setColorMode(colorMode: ColorMode): Promise<void> {
    this._currentColorMode = colorMode;
    this._saveColorMode(colorMode);
    await this._applyTheme(this._currentTheme);
    this._notifyListeners(this._currentTheme, colorMode);
  }

  addThemeChangeListener(
    listener: (theme: ThemeManagerType, colorMode: ColorMode) => void
  ): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  private async _applyTheme(theme: ThemeManagerType): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const themeConfig = availableThemes[theme];

    // 移除之前的主題屬性
    root.removeAttribute('data-theme');

    // 設置新的主題屬性
    if (theme !== 'base') {
      root.setAttribute('data-theme', theme);
    }

    // 設置顏色模式
    root.setAttribute('data-color-mode', this._currentColorMode);

    // 動態設置語義化顏色變數
    this._setSemanticColors(themeConfig);
  }

  private _setSemanticColors(themeConfig: ThemeManagerConfig): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const { primaryColor } = themeConfig;

    // 設置語義化顏色變數，使用當前主題的主要顏色
    const semanticColors = {
      '--color-primary': `var(--color-${primaryColor}-600)`,
      '--color-primary-hover': `var(--color-${primaryColor}-700)`,
      '--color-primary-active': `var(--color-${primaryColor}-800)`,
      '--color-primary-light': `var(--color-${primaryColor}-100)`,
      '--color-primary-bg': `var(--color-${primaryColor}-50)`,
    };

    Object.entries(semanticColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  private _getSavedTheme(): ThemeManagerType | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return (localStorage.getItem('nx-playground-theme') as ThemeManagerType) ?? null;
  }

  private _getSavedColorMode(): ColorMode | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return (localStorage.getItem('nx-playground-color-mode') as ColorMode) ?? null;
  }

  private _saveTheme(theme: ThemeManagerType): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem('nx-playground-theme', theme);
  }

  private _saveColorMode(colorMode: ColorMode): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem('nx-playground-color-mode', colorMode);
  }

  private _notifyListeners(
    theme: ThemeManagerType,
    colorMode: ColorMode
  ): void {
    this._listeners.forEach(listener => {
      try {
        listener(theme, colorMode);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  }
}

// 創建全局主題管理器實例
export const themeManager = new DynamicThemeManager();

// 導出便捷函數
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const getCurrentColorMode = () => themeManager.getCurrentColorMode();
export const getCurrentThemeConfig = () => themeManager.getCurrentThemeConfig();
export const getAvailableThemes = () => themeManager.getAvailableThemes();
export const setTheme = (theme: ThemeManagerType) =>
  themeManager.setTheme(theme);
export const setColorMode = (colorMode: ColorMode) =>
  themeManager.setColorMode(colorMode);
export const addThemeChangeListener = (
  listener: (theme: ThemeManagerType, colorMode: ColorMode) => void
) => themeManager.addThemeChangeListener(listener);

// 獲取主要顏色名稱的函數
export function getPrimaryColorName(): string {
  return themeManager.getCurrentThemeConfig().primaryColor;
}

// 獲取主題主要顏色的函數
export function getThemePrimaryColor(): string {
  const primaryColor = getPrimaryColorName();
  return `var(--color-${primaryColor}-600)`;
}
