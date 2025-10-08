'use client';

import { type ThemeManagerConfig } from '@nx-playground/design-system';
import { type FC } from 'react';

import { Button } from '../../core/Button/Button';

interface ThemeSwitcherProps {
  currentTheme: string;
  availableThemes: ThemeManagerConfig[];
  onThemeChange: (theme: string) => void;
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({
  currentTheme,
  availableThemes,
  onThemeChange,
}) => {
  return (
    <div className='flex items-center gap-4 p-4 bg-background-secondary rounded-lg border border-border-primary'>
      <span className='text-sm font-medium text-text-primary'>主題：</span>
      <div className='flex gap-2'>
        {availableThemes.map(theme => (
          <Button
            key={theme.name}
            variant={currentTheme === theme.name ? 'primary' : 'outline'}
            size='sm'
            onClick={() => onThemeChange(theme.name)}
          >
            {theme.displayName}
          </Button>
        ))}
      </div>
    </div>
  );
};
