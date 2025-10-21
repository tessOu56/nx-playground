import { createFeatureI18n } from '@nx-playground/i18n';

export const eventsI18n = createFeatureI18n({
  namespace: 'cms-events',
  resources: {
    en: {
      translation: () => import('./locales/en/events.json'),
    },
    'zh-TW': {
      translation: () => import('./locales/zh-TW/events.json'),
    },
  },
});
