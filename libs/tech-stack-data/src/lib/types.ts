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
    'zh-TW': '前端框架 & UI',
    en: 'Frontend Frameworks & UI',
  },
  backend: {
    'zh-TW': '後端 & 資料庫',
    en: 'Backend & Database',
  },
  tools: {
    'zh-TW': '工具 & 構建',
    en: 'Tools & Build',
  },
  testing: {
    'zh-TW': '測試',
    en: 'Testing',
  },
  deployment: {
    'zh-TW': '部署',
    en: 'Deployment',
  },
} as const;

export const techLevels = {
  expert: {
    'zh-TW': '專家',
    en: 'Expert',
  },
  advanced: {
    'zh-TW': '進階',
    en: 'Advanced',
  },
  intermediate: {
    'zh-TW': '中階',
    en: 'Intermediate',
  },
} as const;
