import { useEffect, useState } from 'react';

import {
  type ColorMode,
  type ThemeManagerType,
  themeManager,
} from './theme-manager';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeManagerType>(
    themeManager.getCurrentTheme()
  );
  const [currentColorMode, setCurrentColorMode] = useState<ColorMode>(
    themeManager.getCurrentColorMode()
  );

  useEffect(() => {
    const unsubscribe = themeManager.addThemeChangeListener(
      (theme, colorMode) => {
        setCurrentTheme(theme);
        setCurrentColorMode(colorMode);
      }
    );

    return unsubscribe;
  }, []);

  const setTheme = (theme: ThemeManagerType) => {
    themeManager.setTheme(theme);
  };

  const setColorMode = (colorMode: ColorMode) => {
    themeManager.setColorMode(colorMode);
  };

  const availableThemes = themeManager.getAvailableThemes();

  return {
    currentTheme,
    currentColorMode,
    setTheme,
    setColorMode,
    availableThemes,
    themeConfig: themeManager.getCurrentThemeConfig(),
  };
}

// 重新導出主題管理器中的函數
export { getPrimaryColorName, getThemePrimaryColor } from './theme-manager';

export function useThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const switchTheme = (theme: ThemeManagerType) => {
    setTheme(theme);
  };

  return {
    currentTheme,
    switchTheme,
    availableThemes,
  };
}
