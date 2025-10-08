import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

interface I18nConfigOptions {
  namespace: string;
  resources: {
    'zh-TW': Record<string, any>;
    en: Record<string, any>;
  };
}

/**
 * 創建功能模組的 i18n 配置
 * @param options 配置選項
 * @returns i18n 實例
 */
export const createFeatureI18n = (options: I18nConfigOptions) => {
  const { namespace, resources } = options;

  // 檢查 i18n 是否已經初始化
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      lng: 'zh-TW',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }

  // 添加新的命名空間和資源
  i18n.addResourceBundle('zh-TW', namespace, resources['zh-TW'], true, true);
  i18n.addResourceBundle('en', namespace, resources.en, true, true);

  return i18n;
};
