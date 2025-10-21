#!/usr/bin/env node
/**
 * 從 config 提取資料補充到 README Front Matter
 * 確保所有欄位都有完整資料
 */

const fs = require('fs');
const path = require('path');

const matter = require('gray-matter');

const rootDir = path.join(__dirname, '../..');

// Apps 配置資料（手動複製，因為無法直接 require TypeScript）
const appsConfigData = {
  auth: {
    name: 'Auth Service',
    description:
      'Authentication service with Ory Kratos backend, supporting email login, social login, and SSO',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 6',
      'Tailwind CSS',
      'React Hook Form',
      'Zod',
      'Ory Kratos',
    ],
    features: [
      'User Login',
      'User Registration',
      'Email Verification',
      'Password Recovery',
      'Social Login',
      'SSO Integration',
    ],
  },
  'event-cms': {
    name: 'Event Management Console',
    description:
      'Complete event management admin console with drag-and-drop form builder, user management, and role-based access control',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 6',
      'Zustand',
      'React Query',
      'React Hook Form',
      'Tailwind CSS',
    ],
    features: [
      'Event Management',
      'Form Template Editor',
      'User Management',
      'Role Management',
      'i18n Support',
    ],
  },
  'event-portal': {
    name: 'Event Platform',
    description:
      'Event browsing and registration platform with LINE LIFF integration and QR code ticketing',
    techStack: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'LINE LIFF SDK',
      'next-intl',
    ],
    features: [
      'Event Browsing',
      'Event Registration',
      'QR Code Tickets',
      'LINE LIFF Integration',
      'Multi-language Support',
    ],
  },
  profile: {
    name: 'Profile',
    description:
      'Professional portfolio website showcasing technical skills, projects, and shared libraries in a Nx monorepo',
    techStack: ['React 19', 'Vite', 'i18n', 'Tailwind CSS', 'React Router'],
    features: [
      'Multi-language Support',
      'Responsive Design',
      'Apps Showcase',
      'Libs Showcase',
      'Technical Documentation Search',
    ],
  },
  'enterprise-admin': {
    name: 'Enterprise Admin',
    description:
      'Enterprise-level admin console built with Angular 20 Signals, featuring dual-control approval and RBAC',
    techStack: [
      'Angular 20',
      'Signal Store',
      'TypeScript',
      'Tailwind CSS',
      'RxJS',
    ],
    features: [
      'User Management',
      'RBAC',
      'Dual-control Approval',
      'Audit Logs',
      'SSE Real-time Updates',
    ],
  },
  'vue-motion': {
    name: 'Vue Motion Sandbox',
    description:
      'Animation sandbox built with Vue 3, featuring GSAP, Three.js, and Lottie animations',
    techStack: [
      'Vue 3',
      'TypeScript',
      'GSAP',
      'Three.js',
      'Lottie',
      'Tailwind CSS',
    ],
    features: [
      'Animation Playground',
      'GSAP Animations',
      '3D Scenes',
      'Lottie Player',
      'Export Presets',
    ],
  },
  'api-server': {
    name: 'API Server',
    description:
      'RESTful API server built with NestJS and Prisma, providing OpenAPI documentation',
    techStack: [
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'TypeScript',
      'OpenAPI',
      'Swagger',
    ],
    features: [
      'REST API',
      'Database ORM',
      'OpenAPI Docs',
      'Authentication',
      'Authorization',
    ],
  },
};

// Libs 配置資料
const libsConfigData = {
  'ui-components': {
    name: 'UI Components',
    description:
      'Comprehensive UI component library built with React, TypeScript, and Radix UI primitives',
    techStack: ['React 19', 'Radix UI', 'Tailwind CSS', 'TypeScript'],
    features: [
      '40+ components',
      'TypeScript support',
      'Accessibility-first',
      'Form components',
      'Navigation components',
    ],
  },
  'design-system': {
    name: 'Design System',
    description:
      'Design tokens and theming system with Style Dictionary integration',
    techStack: [
      'Style Dictionary',
      'CSS Variables',
      'Tailwind CSS',
      'TypeScript',
    ],
    features: [
      'Design tokens',
      'Multiple themes',
      'CSS variables',
      'Tailwind integration',
      'Token visualization',
    ],
  },
  i18n: {
    name: 'Internationalization',
    description:
      'i18next-based internationalization solution with feature-level translations',
    techStack: ['i18next', 'React', 'TypeScript', 'next-intl'],
    features: [
      'Feature-based namespaces',
      'Language detection',
      'SSR support',
      'Type-safe keys',
      'Dynamic loading',
    ],
  },
  hooks: {
    name: 'Custom Hooks',
    description: 'Collection of reusable React hooks for common patterns',
    techStack: ['React 19', 'TypeScript'],
    features: [
      'useDebounce',
      'useLocalStorage',
      'useAsync',
      'useModal',
      'usePagination',
    ],
  },
  'api-client': {
    name: 'API Client',
    description:
      'Type-safe API client generated from OpenAPI specifications using Orval',
    techStack: ['OpenAPI', 'Orval', 'React Query', 'TypeScript'],
    features: [
      'OpenAPI integration',
      'Auto type generation',
      'React Query hooks',
      'Mock data support',
    ],
  },
  charts: {
    name: 'Chart Components',
    description: 'Chart component library with Chart.js and Recharts support',
    techStack: ['Chart.js', 'Recharts', 'React 19', 'TypeScript'],
    features: [
      'Multiple chart types',
      'Dual library support',
      'Responsive design',
      'Theme integration',
    ],
  },
  'auth-client': {
    name: 'Auth Client',
    description: 'Authentication utilities and context providers',
    techStack: ['React 19', 'TypeScript'],
    features: [
      'Auth context',
      'Protected routes',
      'Session management',
      'Token handling',
    ],
  },
  'enterprise-data': {
    name: 'Enterprise Data',
    description: 'Data handling layer for Angular enterprise applications',
    techStack: ['Angular 20', 'RxJS', 'TypeScript'],
    features: ['Data models', 'Service layer', 'Validators', 'Transformers'],
  },
  'animation-data': {
    name: 'Animation Data',
    description: 'Animation data management for Vue motion applications',
    techStack: ['Vue 3', 'TypeScript'],
    features: ['Animation presets', 'Data transformers', 'Export utilities'],
  },
};

/**
 * 更新 README Front Matter
 */
function updateReadmeFrontMatter(type, projectId, configData) {
  const readmePath = path.join(rootDir, type, projectId, 'README.md');

  if (!fs.existsSync(readmePath)) {
    console.log(`⚠️  ${type}/${projectId}/README.md 不存在`);
    return;
  }

  const content = fs.readFileSync(readmePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);

  // 從 package.json 讀取版本
  const pkgPath = path.join(rootDir, type, projectId, 'package.json');
  let version = '1.0.0';
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      version = pkg.version || '1.0.0';
    } catch (_error) {
      // ignore
    }
  }

  // 合併資料（config 優先）
  const updatedData = {
    ...data,
    id: projectId,
    name: configData.name,
    version,
    description: configData.description,
    techStack: configData.techStack,
    features: configData.features,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  // 寫回檔案
  const newContent = matter.stringify(markdownContent, updatedData);
  fs.writeFileSync(readmePath, newContent);

  console.log(`✅ 更新: ${type}/${projectId}/README.md`);
  console.log(`   techStack: ${configData.techStack.length} 項`);
  console.log(`   features: ${configData.features.length} 項`);
}

/**
 * 主程式
 */
function main() {
  console.log('📝 從 Config 補充 README Front Matter...\n');

  // Apps
  console.log('📱 Apps:');
  Object.entries(appsConfigData).forEach(([id, config]) => {
    updateReadmeFrontMatter('apps', id, config);
  });

  console.log('');

  // Libs
  console.log('📚 Libs:');
  Object.entries(libsConfigData).forEach(([id, config]) => {
    updateReadmeFrontMatter('libs', id, config);
  });

  console.log('');
  console.log('✅ 完成！所有 README 已補充完整資料');
  console.log('');
  console.log('📝 下一步:');
  console.log('   1. 檢查 README Front Matter');
  console.log('   2. 測試 Profile 頁面資料顯示');
}

main();
