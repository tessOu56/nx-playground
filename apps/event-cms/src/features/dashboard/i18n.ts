import { createFeatureI18n } from '@nx-playground/i18n';

// Import dashboard translation files
import enDashboard from './locales/en/dashboard.json';
import zhTWDashboard from './locales/zh-TW/dashboard.json';

// Configure i18next for dashboard
const i18n = createFeatureI18n({
  namespace: 'dashboard',
  resources: {
    'zh-TW': zhTWDashboard,
    en: enDashboard,
  },
});

export default i18n;
