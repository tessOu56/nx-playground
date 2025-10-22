import type { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const LanguageToggle: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract current locale from path
  const currentLocale = location.pathname.match(/^\/(zh-TW|en)/)?.[1] || 'en';

  const switchLanguage = (newLocale: string) => {
    const newPath = location.pathname.replace(/^\/(zh-TW|en)/, `/${newLocale}`);
    navigate(newPath + location.search);
  };

  return (
    <div className='flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-0.5'>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          currentLocale === 'en'
            ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        aria-label='Switch to English'
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('zh-TW')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          currentLocale === 'zh-TW'
            ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
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

