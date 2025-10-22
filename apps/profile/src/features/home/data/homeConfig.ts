/**
 * Home 頁面專用配置
 * 包含個人資料、技能、聯絡方式、經驗等
 */

export interface Experience {
  year: string;
  title: {
    'zh-TW': string;
    en: string;
  };
  description: {
    'zh-TW': string;
    en: string;
  };
}

export interface HomeConfig {
  tagline: {
    'zh-TW': string;
    en: string;
  };
  shortBio: {
    'zh-TW': string;
    en: string;
  };
  contact: {
    email?: string;
    github?: string;
    linkedin?: string;
  };
  availability: {
    'zh-TW': string;
    en: string;
  };
  experience: Experience[];
}

export const homeConfig: HomeConfig = {
  tagline: {
    'zh-TW': '專精 React 的前端架構規劃與技術探索',
    en: 'React Specialist with Frontend Architecture & Tech Exploration',
  },
  shortBio: {
    'zh-TW':
      '專注 React 生態系開發，熟悉多種前端框架實踐。擅長前端架構規劃與技術趨勢研究。',
    en: 'Focused on React ecosystem development with hands-on experience in multiple frontend frameworks. Specializing in frontend architecture design and tech trend exploration.',
  },
  contact: {
    github: 'https://github.com/yourusername',
    email: 'your.email@example.com',
  },
  availability: {
    'zh-TW': '開放自由接案與全職工作機會',
    en: 'Open for freelance projects and full-time opportunities',
  },
  experience: [
    {
      year: '2024',
      title: {
        'zh-TW': 'Nx Monorepo 架構實踐',
        en: 'Nx Monorepo Architecture Practice',
      },
      description: {
        'zh-TW':
          '建立多框架 monorepo 專案，實踐設計系統、共享函式庫與現代工具鏈整合',
        en: 'Built multi-framework monorepo projects with design systems, shared libraries, and modern toolchain integration',
      },
    },
    {
      year: '2023',
      title: {
        'zh-TW': 'React 生態系深度探索',
        en: 'Deep Dive into React Ecosystem',
      },
      description: {
        'zh-TW':
          '深入研究 React 19、Next.js 15、狀態管理與效能優化實踐',
        en: 'In-depth research on React 19, Next.js 15, state management, and performance optimization',
      },
    },
    {
      year: '2022',
      title: {
        'zh-TW': '多框架開發經驗',
        en: 'Multi-Framework Development',
      },
      description: {
        'zh-TW': '實踐 Angular、Vue 等框架開發，建立跨框架技術視野',
        en: 'Hands-on experience with Angular, Vue and other frameworks to build cross-framework technical perspective',
      },
    },
  ],
};

