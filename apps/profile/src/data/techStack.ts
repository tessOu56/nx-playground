export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'testing' | 'deployment';
  level: 'expert' | 'advanced' | 'intermediate';
  icon?: string;
  color?: string;
  url?: string; // Link to official website or GitHub
}

export const techStack: TechItem[] = [
  // Frontend Frameworks
  {
    name: 'React 19',
    category: 'frontend',
    level: 'expert',
    color: '#61DAFB',
    url: 'https://react.dev',
  },
  {
    name: 'Angular 20',
    category: 'frontend',
    level: 'advanced',
    color: '#DD0031',
    url: 'https://angular.dev',
  },
  {
    name: 'Vue 3',
    category: 'frontend',
    level: 'advanced',
    color: '#42B883',
    url: 'https://vuejs.org',
  },
  {
    name: 'Next.js 15',
    category: 'frontend',
    level: 'expert',
    color: '#000000',
    url: 'https://nextjs.org',
  },

  // State Management
  { name: 'Zustand', category: 'frontend', level: 'expert', color: '#453E39' },
  {
    name: 'React Query',
    category: 'frontend',
    level: 'expert',
    color: '#FF4154',
  },
  {
    name: 'Angular Signals',
    category: 'frontend',
    level: 'advanced',
    color: '#DD0031',
  },

  // Styling & UI
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    level: 'expert',
    color: '#06B6D4',
  },
  {
    name: 'Radix UI',
    category: 'frontend',
    level: 'advanced',
    color: '#161618',
  },
  {
    name: 'GSAP',
    category: 'frontend',
    level: 'intermediate',
    color: '#88CE02',
  },
  {
    name: 'Three.js',
    category: 'frontend',
    level: 'intermediate',
    color: '#000000',
  },

  // Build Tools
  { name: 'Vite 6', category: 'tools', level: 'expert', color: '#646CFF' },
  { name: 'Webpack', category: 'tools', level: 'advanced', color: '#8DD6F9' },
  { name: 'Nx Monorepo', category: 'tools', level: 'expert', color: '#143055' },

  // Backend
  { name: 'NestJS', category: 'backend', level: 'advanced', color: '#E0234E' },
  { name: 'Prisma', category: 'backend', level: 'advanced', color: '#2D3748' },
  {
    name: 'PostgreSQL',
    category: 'backend',
    level: 'intermediate',
    color: '#336791',
  },

  // Testing
  { name: 'Jest', category: 'testing', level: 'advanced', color: '#C21325' },
  { name: 'Vitest', category: 'testing', level: 'advanced', color: '#6E9F18' },
  {
    name: 'Playwright',
    category: 'testing',
    level: 'intermediate',
    color: '#2EAD33',
  },

  // TypeScript & Languages
  {
    name: 'TypeScript',
    category: 'frontend',
    level: 'expert',
    color: '#3178C6',
  },

  // Authentication
  {
    name: 'Ory Kratos',
    category: 'backend',
    level: 'advanced',
    color: '#5528FF',
  },
  {
    name: 'OAuth 2.0',
    category: 'backend',
    level: 'advanced',
    color: '#000000',
  },

  // I18n
  { name: 'i18next', category: 'frontend', level: 'expert', color: '#26A69A' },
  {
    name: 'next-intl',
    category: 'frontend',
    level: 'advanced',
    color: '#000000',
  },

  // API & Integration
  { name: 'OpenAPI', category: 'tools', level: 'advanced', color: '#6BA539' },
  { name: 'Orval', category: 'tools', level: 'advanced', color: '#000000' },
  { name: 'REST API', category: 'backend', level: 'expert', color: '#009688' },

  // Deployment
  {
    name: 'Cloudflare Pages',
    category: 'deployment',
    level: 'advanced',
    color: '#F38020',
  },
  {
    name: 'Docker',
    category: 'deployment',
    level: 'intermediate',
    color: '#2496ED',
  },

  // LINE Platform
  {
    name: 'LINE LIFF',
    category: 'frontend',
    level: 'advanced',
    color: '#00B900',
  },
];

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
