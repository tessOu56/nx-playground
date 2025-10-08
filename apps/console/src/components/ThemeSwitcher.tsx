import { getAvailableThemes, useTheme } from '@nx-playground/design-system';
import { ThemeSwitcher as UIThemeSwitcher } from '@nx-playground/ui-components';
import * as React from 'react';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const availableThemes = getAvailableThemes();

  return (
    <UIThemeSwitcher
      currentTheme={currentTheme}
      availableThemes={availableThemes}
      onThemeChange={(theme: string) => setTheme(theme as any)}
    />
  );
};
