import {
  addThemeChangeListener,
  getCurrentColorMode,
  setColorMode,
} from '@nx-playground/design-system';
import { Button } from '@nx-playground/ui-components';
import { type FC, useEffect, useState } from 'react';

export const ColorModeSwitcher: FC = () => {
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>(
    getCurrentColorMode()
  );

  useEffect(() => {
    const unsubscribe = addThemeChangeListener((_, colorMode) => {
      setCurrentMode(colorMode);
    });

    return unsubscribe;
  }, []);

  const handleModeChange = (mode: 'light' | 'dark') => {
    setColorMode(mode);
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant={currentMode === 'light' ? 'primary' : 'outline'}
        size='sm'
        onClick={() => handleModeChange('light')}
      >
        淺色
      </Button>
      <Button
        variant={currentMode === 'dark' ? 'primary' : 'outline'}
        size='sm'
        onClick={() => handleModeChange('dark')}
      >
        深色
      </Button>
    </div>
  );
};
