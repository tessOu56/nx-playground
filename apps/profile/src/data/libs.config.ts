export interface LibConfig {
  id: string;
  name: string;
  packageName: string;
  category: 'ui' | 'data' | 'utils';
  description: string;
  purpose: string;
  highlights: string[];
  stats?: {
    components?: number;
    hooks?: number;
    utilities?: number;
  };
}

export const libsConfig: LibConfig[] = [
  {
    id: 'ui-components',
    name: 'UI Components',
    packageName: '@nx-playground/ui-components',
    category: 'ui',
    description:
      'Comprehensive UI component library built with React, TypeScript, and Radix UI primitives',
    purpose:
      'Provides consistent, accessible, and reusable UI components across all applications',
    highlights: [
      '40+ production-ready components',
      'Full TypeScript support',
      'Accessibility-first design (WCAG 2.1)',
      'Tailwind CSS integration',
      'Radix UI primitives',
      'Form components with validation',
      'Navigation and layout components',
      'Feedback components (Toast, Modal, Alert)',
    ],
    stats: {
      components: 40,
    },
  },
  {
    id: 'design-system',
    name: 'Design System',
    packageName: '@nx-playground/design-system',
    category: 'ui',
    description:
      'Design tokens and theming system with Style Dictionary integration',
    purpose:
      'Ensures consistent design language across applications with token-based theming',
    highlights: [
      'Design token management with Style Dictionary',
      'Multiple theme support (base, enterprise, monochrome)',
      'CSS variables generation',
      'Tailwind configuration integration',
      'Type-safe design tokens',
      'Theme manager utilities',
      'Token visualization tools',
    ],
  },
  {
    id: 'i18n',
    name: 'Internationalization',
    packageName: '@nx-playground/i18n',
    category: 'utils',
    description:
      'i18next-based internationalization solution with feature-level translations',
    purpose:
      'Enables multi-language support with namespace isolation and SSR compatibility',
    highlights: [
      'Feature-based namespace system',
      'Language detection and persistence',
      'SSR support for Next.js with next-intl',
      'Type-safe translation keys',
      'Language switcher components',
      'Dynamic translation loading',
      'Support for zh-TW and en locales',
    ],
  },
  {
    id: 'hooks',
    name: 'Custom Hooks',
    packageName: '@nx-playground/hooks',
    category: 'utils',
    description: 'Collection of reusable React hooks for common patterns',
    purpose:
      'Simplifies state management and side effects with well-tested hooks',
    highlights: [
      'useDebounce & useThrottle for performance',
      'useLocalStorage & useSessionStorage for persistence',
      'useAsync for data fetching patterns',
      'useModal & useToast for UI state',
      'usePagination for list management',
      'Fully typed with TypeScript',
      'Comprehensive JSDoc documentation',
    ],
    stats: {
      hooks: 8,
    },
  },
  {
    id: 'api-client',
    name: 'API Client',
    packageName: '@nx-playground/api-client',
    category: 'data',
    description:
      'Type-safe API client generated from OpenAPI specifications using Orval',
    purpose: 'Provides fully typed API calls with automatic code generation',
    highlights: [
      'OpenAPI/Swagger integration',
      'Automatic TypeScript type generation',
      'React Query hooks generation',
      'Error handling and retry logic',
      'Mock data support for development',
      'Multiple API endpoint support',
      'Smart API switching (mock/real)',
    ],
  },
  {
    id: 'charts',
    name: 'Chart Components',
    packageName: '@nx-playground/charts',
    category: 'ui',
    description: 'Chart component library with Chart.js and Recharts support',
    purpose: 'Visualize data with responsive and customizable chart components',
    highlights: [
      'Multiple chart types (Line, Bar, Pie, Area)',
      'Dual library support (Chart.js & Recharts)',
      'Responsive design',
      'Theme integration',
      'TypeScript support with typed props',
      'Customizable styling',
      'Animation support',
    ],
    stats: {
      components: 8,
    },
  },
  {
    id: 'auth-client',
    name: 'Auth Client',
    packageName: '@nx-playground/auth-client',
    category: 'utils',
    description: 'Authentication utilities and context providers',
    purpose: 'Simplifies authentication implementation across applications',
    highlights: [
      'Auth context provider with React Context',
      'Protected route components',
      'Session management utilities',
      'Auth redirect helpers',
      'Token handling and storage',
      'Logout and cleanup utilities',
      'TypeScript types for auth state',
    ],
  },
];

export const libCategories = {
  ui: {
    'zh-TW': 'UI 與設計',
    en: 'UI & Design',
  },
  data: {
    'zh-TW': '資料與狀態',
    en: 'Data & State',
  },
  utils: {
    'zh-TW': '工具與輔助',
    en: 'Utilities & Tools',
  },
} as const;

export const libBenefits = [
  {
    title: {
      'zh-TW': '程式碼可重用性',
      en: 'Code Reusability',
    },
    description: {
      'zh-TW': '編寫一次，到處使用。減少重複和維護開銷',
      en: 'Write once, use everywhere. Reduce duplication and maintenance overhead',
    },
  },
  {
    title: {
      'zh-TW': '型別安全',
      en: 'Type Safety',
    },
    description: {
      'zh-TW': '完整的 TypeScript 支援確保編譯時錯誤檢測',
      en: 'Full TypeScript support ensures compile-time error detection',
    },
  },
  {
    title: {
      'zh-TW': '一致性',
      en: 'Consistency',
    },
    description: {
      'zh-TW': '在所有應用程式中保持一致的使用者體驗和行為',
      en: 'Maintain consistent UX and behavior across all applications',
    },
  },
  {
    title: {
      'zh-TW': '獨立更新',
      en: 'Independent Updates',
    },
    description: {
      'zh-TW': '透過適當的版本控制獨立更新函式庫',
      en: 'Update libraries independently with proper versioning',
    },
  },
  {
    title: {
      'zh-TW': 'Tree Shaking',
      en: 'Tree Shaking',
    },
    description: {
      'zh-TW': '只匯入所需內容，減少打包大小',
      en: 'Import only what you need, reducing bundle sizes',
    },
  },
  {
    title: {
      'zh-TW': '可測試性',
      en: 'Testability',
    },
    description: {
      'zh-TW': '在函式庫層級測試一次，所有應用程式都受益',
      en: 'Test once at the library level, benefit across all apps',
    },
  },
];

