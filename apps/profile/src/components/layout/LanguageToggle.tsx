import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const LanguageToggle: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Extract current locale from path
  const currentLocale = location.pathname.match(/^\/(zh-TW|en)/)?.[1] || 'en';

  const switchLanguage = (newLocale: string) => {
    // Update i18n language
    i18n.changeLanguage(newLocale);

    // Update URL
    const newPath = location.pathname.replace(/^\/(zh-TW|en)/, `/${newLocale}`);
    navigate(newPath + location.search);
  };

  return (
    <div className='relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-0.5'>
      {/* Sliding background indicator */}
      <div
        className={`absolute top-0.5 bottom-0.5 w-12 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-transform duration-300 ease-out ${
          currentLocale === 'en' ? 'translate-x-0' : 'translate-x-12'
        }`}
        aria-hidden='true'
      />
      
      {/* Language buttons */}
      <button
        onClick={() => switchLanguage('en')}
        className={`relative z-10 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
          currentLocale === 'en'
            ? 'text-blue-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        aria-label='Switch to English'
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('zh-TW')}
        className={`relative z-10 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
          currentLocale === 'zh-TW'
            ? 'text-blue-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        aria-label='Switch to Traditional Chinese'
        aria-pressed={currentLocale === 'zh-TW'}
      >
        繁中
      </button>
    </div>
  );
};
