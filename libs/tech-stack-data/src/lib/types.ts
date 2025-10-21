export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'testing' | 'deployment';
  level?: 'expert' | 'advanced' | 'intermediate';
  icon?: string;
  color?: string;
  url?: string;
  version?: string;
  projects?: string[]; // 哪些專案使用此技術
}

export const techCategories = {
  frontend: {
    'zh-TW': '前端框架',
    en: 'Frontend Frameworks',
  },
  backend: {
    'zh-TW': '後端技術',
    en: 'Backend Technologies',
  },
  tools: {
    'zh-TW': '開發工具',
    en: 'Development Tools',
  },
  testing: {
    'zh-TW': '測試框架',
    en: 'Testing Frameworks',
  },
  deployment: {
    'zh-TW': '部署工具',
    en: 'Deployment & CI/CD',
  },
} as const;
