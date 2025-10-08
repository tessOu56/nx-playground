// 將現有的 locales 結構轉換為 next-intl 格式
import enCommon from '../../locales/en/common.json';
import enUI from '../../locales/en/ui.json';
import zhTWCommon from '../../locales/zh-TW/common.json';
import zhTWUI from '../../locales/zh-TW/ui.json';

// 合併 common 和 ui 命名空間
export const messages = {
  'zh-TW': {
    ...zhTWCommon,
    ...zhTWUI,
  },
  en: {
    ...enCommon,
    ...enUI,
  },
} as const;
