'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE, type SupportedLanguage } from './i18n';
import { initI18n } from './i18nSSR';

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isLanguageChanging: boolean;
}

// 創建一個統一的 Context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * 獲取預設語言 (支援環境變數)
 */
const getDefaultLanguage = (): SupportedLanguage => {
  if (
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
  ) {
    return process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
};

/**
 * SSR 環境的 i18n 值
 */
const createSSRI18nValue = (): I18nContextType => ({
  currentLanguage: getDefaultLanguage(),
  changeLanguage: async () => {
    // 空的 async 方法，避免 TypeScript 報錯
  },
  isLanguageChanging: false,
});

/**
 * 統一的 i18n Provider，自動處理 SSR 和客戶端環境
 * 支援 Next.js 和 Vite 兩種開發環境
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [i18nValue, setI18nValue] =
    useState<I18nContextType>(createSSRI18nValue);

  // 在客戶端使用 react-i18next
  const { i18n } = useTranslation();
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);

  // 確保只在客戶端運行並初始化 i18n
  useEffect(() => {
    setIsClient(true);
    // 在客戶端初始化 i18n
    initI18n();
  }, []);

  // 客戶端 i18n 邏輯
  useEffect(() => {
    if (isClient && i18n) {
      const currentLanguage =
        (i18n.language as SupportedLanguage) || getDefaultLanguage();

      const changeLanguage = async (language: SupportedLanguage) => {
        if (language === currentLanguage) return;

        setIsLanguageChanging(true);
        try {
          await i18n.changeLanguage(language);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to change language:', error);
        } finally {
          setIsLanguageChanging(false);
        }
      };

      // 設置 document language attribute
      if (typeof document !== 'undefined') {
        document.documentElement.lang = currentLanguage;
      }

      setI18nValue({
        currentLanguage,
        changeLanguage,
        isLanguageChanging,
      });
    }
  }, [isClient, i18n, isLanguageChanging]);

  return (
    <I18nContext.Provider value={i18nValue}>{children}</I18nContext.Provider>
  );
}

/**
 * 向後兼容的別名
 */
export const I18nProviderSmart = I18nProvider;

/**
 * 使用智能 Context 的 hook
 */
export function useI18nSmartContext(): I18nContextType {
  const context = useContext(I18nContext);

  // 在 SSR 時，如果沒有 context，返回預設值
  if (typeof window === 'undefined' && context === undefined) {
    return createSSRI18nValue();
  }

  if (context === undefined) {
    throw new Error('useI18nSmartContext must be used within an I18nProvider');
  }

  return context;
}

/**
 * 向後兼容的別名
 */
export const useI18nSmart = useI18nSmartContext;
