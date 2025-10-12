import { LanguageSwitcher ,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';
import * as React from 'react';

import { ColorModeSwitcher } from '../../../components/ColorModeSwitcher';
import { ThemeSwitcher } from '../../../components/ThemeSwitcher';
import { useSettingsTranslation } from '../hooks/useSettingsTranslation';

import '../i18n';

export const SettingsPage: React.FC = () => {
  const { t } = useSettingsTranslation();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          {t('settings.title') as string}
        </h1>
        <p className='text-gray-600'>{t('settings.description') as string}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.appearance.title') as string}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>
                  {t('settings.appearance.theme.title') as string}
                </h3>
                <p className='text-sm text-gray-500'>
                  {t('settings.appearance.theme.description') as string}
                </p>
              </div>
              <ThemeSwitcher />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>
                  {t('settings.appearance.colorMode.title') as string}
                </h3>
                <p className='text-sm text-gray-500'>
                  {t('settings.appearance.colorMode.description') as string}
                </p>
              </div>
              <ColorModeSwitcher />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>
                  {t('settings.appearance.language.title') as string}
                </h3>
                <p className='text-sm text-gray-500'>
                  {t('settings.appearance.language.description') as string}
                </p>
              </div>
              <LanguageSwitcher variant='dropdown' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
