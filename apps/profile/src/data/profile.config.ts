export interface ProfileConfig {
  name: string;
  title: {
    'zh-TW': string;
    en: string;
  };
  bio: {
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
}

export const profileConfig: ProfileConfig = {
  name: 'NX Playground',
  title: {
    'zh-TW': '全端工程師 & Nx Monorepo 專家',
    en: 'Full-Stack Developer & Nx Monorepo Specialist',
  },
  bio: {
    'zh-TW':
      '熱衷於使用 monorepo 架構構建可維護和可擴展的應用程式。在全端開發方面經驗豐富，專注於現代前端框架和企業級解決方案。具有 React、Angular、Vue 等多框架開發經驗，善於使用 Nx 管理大型專案。目前接受自由接案專案和全職工作機會。',
    en: 'Passionate about building maintainable and scalable applications using monorepo architecture. Experienced in full-stack development with focus on modern frontend frameworks and enterprise-grade solutions. Skilled in React, Angular, Vue, and proficient in managing large-scale projects with Nx. Currently available for freelance projects and full-time opportunities.',
  },
  contact: {
    github: 'https://github.com/yourusername',
  },
  availability: {
    'zh-TW': '接受自由接案專案和全職工作機會',
    en: 'Available for freelance projects and full-time opportunities',
  },
};
