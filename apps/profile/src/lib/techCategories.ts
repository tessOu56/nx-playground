/**
 * 技术分类和颜色映射系统
 * 用于统一所有技术标签的外观和行为
 */

export type TechCategory = 'frontend' | 'backend' | 'tools' | 'testing' | 'deployment';

/**
 * 技术分类颜色配置（淡彩色 shadcn 风格）
 */
export const techCategoryColors = {
  frontend: {
    bg: 'bg-blue-100 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-200 dark:hover:bg-blue-900',
  },
  backend: {
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    hover: 'hover:bg-green-200 dark:hover:bg-green-900',
  },
  tools: {
    bg: 'bg-purple-100 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:bg-purple-200 dark:hover:bg-purple-900',
  },
  testing: {
    bg: 'bg-yellow-100 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900',
  },
  deployment: {
    bg: 'bg-pink-100 dark:bg-pink-950',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800',
    hover: 'hover:bg-pink-200 dark:hover:bg-pink-900',
  },
} as const;

/**
 * 技术名称到分类的映射
 * 用于自动判断技术所属分类
 */
export const techToCategoryMap: Record<string, TechCategory> = {
  // Frontend
  'React 19': 'frontend',
  'React': 'frontend',
  'Angular 20': 'frontend',
  'Angular': 'frontend',
  'Vue 3': 'frontend',
  'Vue': 'frontend',
  'Next.js 15': 'frontend',
  'Next.js': 'frontend',
  'Zustand': 'frontend',
  'React Query': 'frontend',
  'Angular Signals': 'frontend',
  'Signal Store': 'frontend',
  'Tailwind CSS': 'frontend',
  'Radix UI': 'frontend',
  'GSAP': 'frontend',
  'Three.js': 'frontend',
  'TypeScript': 'frontend',
  'i18next': 'frontend',
  'i18n': 'frontend',
  'next-intl': 'frontend',
  'LINE LIFF': 'frontend',
  'React Hook Form': 'frontend',
  'React Router': 'frontend',
  'SSG': 'frontend',
  'Animation': 'frontend',
  'Lottie': 'frontend',
  'CSS': 'frontend',

  // Backend
  'NestJS': 'backend',
  'Prisma': 'backend',
  'PostgreSQL': 'backend',
  'Ory Kratos': 'backend',
  'OAuth 2.0': 'backend',
  'Authentication': 'backend',
  'SSO': 'backend',
  'REST API': 'backend',
  'OpenAPI': 'backend',
  'RBAC': 'backend',
  'Dual-control': 'backend',
  'SSE': 'backend',
  'Security': 'backend',
  'CMS': 'backend',
  'Data Layer': 'backend',

  // Tools
  'Vite 6': 'tools',
  'Vite': 'tools',
  'Webpack': 'tools',
  'Nx Monorepo': 'tools',
  'Nx': 'tools',
  'Orval': 'tools',
  'Architecture': 'tools',

  // Testing
  'Jest': 'testing',
  'Vitest': 'testing',
  'Playwright': 'testing',

  // Deployment
  'Cloudflare Pages': 'deployment',
  'Cloudflare': 'deployment',
  'Docker': 'deployment',
  'ArgoCD': 'deployment',
  'CI/CD': 'deployment',

  // Common variations
  'Portfolio': 'frontend',
  'Sandbox': 'tools',
  'QR Code': 'frontend',
};

/**
 * 根据技术名称获取分类
 * @param techName 技术名称
 * @returns 技术分类，默认为 frontend
 */
export function getTechCategory(techName: string): TechCategory {
  return techToCategoryMap[techName] || 'frontend';
}

/**
 * 获取技术分类的颜色类名
 * @param category 技术分类
 * @returns Tailwind 颜色类名
 */
export function getCategoryColorClasses(category: TechCategory) {
  return techCategoryColors[category];
}

