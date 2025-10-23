import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const LanguageToggle: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const savedScrollPosition = useRef<number>(0);
  const isLanguageSwitch = useRef<boolean>(false);

  // Extract current locale from path
  const currentLocale = location.pathname.match(/^\/(zh-TW|en)/)?.[1] || 'en';

  // Restore scroll position after language switch
  useEffect(() => {
    if (isLanguageSwitch.current && savedScrollPosition.current > 0) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({
          top: savedScrollPosition.current,
          behavior: 'instant' as ScrollBehavior,
        });
        isLanguageSwitch.current = false;
        savedScrollPosition.current = 0;
      }, 0);
    }
  }, [location.pathname]);

  const switchLanguage = (newLocale: string) => {
    // Save current scroll position
    savedScrollPosition.current = window.scrollY;
    isLanguageSwitch.current = true;

    // Update i18n language
    i18n.changeLanguage(newLocale);

    // Update URL
    const newPath = location.pathname.replace(/^\/(zh-TW|en)/, `/${newLocale}`);
    navigate(newPath + location.search, { replace: true });
  };

  return (
    <div className='relative flex items-center bg-gray-200/50 dark:bg-gray-700/50 rounded-full p-0.5 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50'>
      {/* Sliding background indicator */}
      <div
        className={`absolute top-0.5 bottom-0.5 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-transform duration-300 ease-out ${
          currentLocale === 'en' ? 'translate-x-0' : 'translate-x-12'
        }`}
        aria-hidden='true'
      />

      {/* Language buttons - full clickable area */}
      <button
        onClick={() => switchLanguage('en')}
        className={`relative z-10 w-12 h-6 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center ${
          currentLocale === 'en'
            ? 'text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        aria-label='Switch to English'
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('zh-TW')}
        className={`relative z-10 w-12 h-6 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center ${
          currentLocale === 'zh-TW'
            ? 'text-white'
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
