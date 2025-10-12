import { i18n } from '@nx-playground/i18n';

// 導入翻譯文件
import enSidebar from './locales/en/sidebar.json';
import zhTWSidebar from './locales/zh-TW/sidebar.json';

// 添加翻譯資源
i18n.addResourceBundle('en', 'sidebar', enSidebar);
i18n.addResourceBundle('zh-TW', 'sidebar', zhTWSidebar);
