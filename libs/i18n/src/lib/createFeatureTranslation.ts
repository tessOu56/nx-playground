import { useTranslation } from 'react-i18next';

/**
 * 創建功能模組的翻譯 hook
 * @param namespace 翻譯命名空間
 * @param translationKeys 翻譯鍵值類型
 * @returns 翻譯 hook
 */
export const createFeatureTranslation = <T extends string>(
  namespace: string,
  _translationKeys: T[]
) => {
  return () => {
    const { t, i18n, ready } = useTranslation(namespace);

    const translate = (key: T, options?: any) => {
      return t(key, options);
    };

    return {
      t: translate,
      i18n,
      ready,
      currentLanguage: i18n.language,
      changeLanguage: i18n.changeLanguage,
    };
  };
};
