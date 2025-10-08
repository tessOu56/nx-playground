import { useTranslation } from '@nx-playground/i18n';
import { LanguageSwitcher } from '@nx-playground/ui-components';
import { type FC } from 'react';

export const I18nDemo: FC = () => {
  const { t } = useTranslation();

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-4'>
          {t('navigation.dashboard') as string} - i18n Demo
        </h1>
        <p className='text-gray-600 mb-4'>
          {t('common.loading') as string} - This is a demonstration of the i18n
          functionality.
        </p>

        {/* Language Switcher */}
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Language Switcher</h2>
          <div className='flex gap-4'>
            <LanguageSwitcher variant='dropdown' />
            <LanguageSwitcher variant='buttons' />
          </div>
        </div>
      </div>

      {/* Translation Examples */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Common Actions */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>Common Actions</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Save:</span>
              <span className='font-medium'>{t('common.save') as string}</span>
            </div>
            <div className='flex justify-between'>
              <span>Cancel:</span>
              <span className='font-medium'>
                {t('common.cancel') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Delete:</span>
              <span className='font-medium'>
                {t('common.delete') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Edit:</span>
              <span className='font-medium'>{t('common.edit') as string}</span>
            </div>
            <div className='flex justify-between'>
              <span>Add:</span>
              <span className='font-medium'>{t('common.add') as string}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>Navigation</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Home:</span>
              <span className='font-medium'>
                {t('navigation.home') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Settings:</span>
              <span className='font-medium'>
                {t('navigation.settings') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Profile:</span>
              <span className='font-medium'>
                {t('navigation.profile') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Logout:</span>
              <span className='font-medium'>
                {t('navigation.logout') as string}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>Form Fields</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Email:</span>
              <span className='font-medium'>
                {t('form.fields.email') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Password:</span>
              <span className='font-medium'>
                {t('form.fields.password') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>First Name:</span>
              <span className='font-medium'>
                {t('form.fields.firstName') as string}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Last Name:</span>
              <span className='font-medium'>
                {t('form.fields.lastName') as string}
              </span>
            </div>
          </div>
        </div>

        {/* Table Actions */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>Table Actions</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>View:</span>
              <span className='font-medium'>{t('table.view') as string}</span>
            </div>
            <div className='flex justify-between'>
              <span>Edit:</span>
              <span className='font-medium'>{t('table.edit') as string}</span>
            </div>
            <div className='flex justify-between'>
              <span>Delete:</span>
              <span className='font-medium'>{t('table.delete') as string}</span>
            </div>
            <div className='flex justify-between'>
              <span>Export:</span>
              <span className='font-medium'>{t('table.export') as string}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='mt-6 bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold mb-4'>Messages</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium text-green-600'>Success Messages</h4>
            <div className='text-sm space-y-1'>
              <div>{t('messages.success.saved') as string}</div>
              <div>{t('messages.success.deleted') as string}</div>
              <div>{t('messages.success.updated') as string}</div>
            </div>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-red-600'>Error Messages</h4>
            <div className='text-sm space-y-1'>
              <div>{t('messages.error.saveFailed') as string}</div>
              <div>{t('messages.error.deleteFailed') as string}</div>
              <div>{t('messages.error.networkError') as string}</div>
            </div>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-blue-600'>Confirmation Messages</h4>
            <div className='text-sm space-y-1'>
              <div>{t('messages.confirm.delete') as string}</div>
              <div>{t('messages.confirm.logout') as string}</div>
              <div>{t('messages.confirm.discard') as string}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
