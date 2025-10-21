export interface AppConfig {
  id: string;
  name: string;
  category: 'react' | 'angular' | 'vue' | 'nextjs';
  techStack: string[];
  features: string[];
  highlights: string[];
  demoUrl?: string;
  githubUrl?: string;
  localDevCommand: string;
  status: 'deployed' | 'coming-soon';
}

export const appsConfig: AppConfig[] = [
  {
    id: 'auth',
    name: 'Auth Service',
    category: 'react',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 6',
      'Tailwind CSS',
      'React Hook Form',
      'Zod',
      'Ory Kratos',
      'Cloudflare Turnstile',
    ],
    features: [
      'User Login (Email + Social Login)',
      'User Registration',
      'Email Verification',
      'Password Recovery',
      'Third-party Login (Google, Apple, LINE)',
      'Cloudflare Turnstile Verification',
      'SSO Integration',
    ],
    highlights: [
      'Custom authentication UI with Ory Kratos backend',
      'Form validation with React Hook Form + Zod',
      'Multi-provider social authentication',
      'Bot protection with Cloudflare Turnstile',
      'Responsive design with Tailwind CSS',
    ],
    localDevCommand: 'pnpm dev:auth',
    status: 'coming-soon',
  },
  {
    id: 'event-cms',
    name: 'Event Management Console',
    category: 'react',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite 6',
      'React Router 6',
      'Zustand',
      'React Query',
      'React Hook Form',
      'Tailwind CSS',
      '@nx-playground/ui-components',
      '@nx-playground/design-system',
      '@nx-playground/i18n',
    ],
    features: [
      'Event Management (List, Create, Edit)',
      'Drag-and-drop Form Template Editor',
      'User Management',
      'Role Management',
      'UI Components Showcase',
      'Internationalization (zh-TW, en)',
    ],
    highlights: [
      'Complete admin console built with React 19',
      'Feature-based architecture with clear separation',
      'Custom form builder with drag-and-drop',
      'Comprehensive UI component library integration',
      'Multi-language support with i18next',
      'State management with Zustand',
    ],
    localDevCommand: 'pnpm dev:event-cms',
    status: 'coming-soon',
  },
  {
    id: 'event-portal',
    name: 'Event Platform',
    category: 'nextjs',
    techStack: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'React Query',
      'Zustand',
      'LINE LIFF SDK',
      'next-intl',
      '@nx-playground/ui-components',
    ],
    features: [
      'Event Browsing & Details',
      'Registration Flow',
      'Shopping Cart',
      'Dynamic Registration Forms',
      'Order Management',
      'QR Code Ticketing',
      'LINE Integration',
      'Multilingual (zh-TW, en)',
      'SSG (Static Site Generation)',
    ],
    highlights: [
      'Built with Next.js 15 App Router',
      'LINE LIFF integration for authentication',
      'SSG with 105+ static pages',
      'Multi-language routing with next-intl',
      'QR code generation for tickets',
      'Complete event management workflow',
      'Mock data system for development',
    ],
    localDevCommand: 'pnpm dev:event-portal',
    status: 'coming-soon',
  },
  {
    id: 'enterprise-admin',
    name: 'Enterprise Admin System',
    category: 'angular',
    techStack: [
      'Angular 20',
      'TypeScript',
      'RxJS',
      'Signal Store',
      'Tailwind CSS',
      'Playwright',
    ],
    features: [
      'RBAC (Role-Based Access Control)',
      'Dual-control Approval Workflow',
      'Real-time Event Monitoring (SSE)',
      'Audit Trail System',
      'Feature Flag Management',
      'Dynamic Form System',
      'Virtual Scrolling',
      'Comprehensive Accessibility (WCAG 2.1)',
    ],
    highlights: [
      'Enterprise-grade Angular 20 application',
      'RBAC with route guards and UI-level permissions',
      'Dual-control approval for high-risk operations',
      'Real-time SSE streaming with Ring Buffer',
      'Signal Store for reactive state management',
      'Complete audit logging system',
      'Performance optimized with virtual scrolling',
      'Full accessibility support',
    ],
    localDevCommand: 'pnpm dev:enterprise',
    status: 'coming-soon',
  },
  {
    id: 'vue-motion',
    name: 'Vue Motion Library',
    category: 'vue',
    techStack: [
      'Vue 3',
      'TypeScript',
      'Vue Router 4',
      'Tailwind CSS',
      'GSAP',
      'Three.js',
      'Lottie',
      'VueUse Motion',
      'Tween.js',
    ],
    features: [
      'Interactive Particle System',
      'GSAP Animations',
      'Three.js 3D Graphics',
      'Lottie Animations',
      'VueUse Motion Integration',
      'Interactive Effects (Mouse tracking, Ripple, Drag & Drop)',
      'Touch Gesture Support',
    ],
    highlights: [
      'Vue 3 Composition API showcase',
      'Advanced animation techniques with GSAP',
      '3D graphics with Three.js integration',
      'Particle systems with mouse interaction',
      'Declarative animations with VueUse Motion',
      'Responsive design for all screen sizes',
      'Performance optimized animations',
    ],
    localDevCommand: 'pnpm dev:vue-motion',
    status: 'coming-soon',
  },
];

export const appCategories = {
  react: {
    'zh-TW': 'React',
    en: 'React',
  },
  angular: {
    'zh-TW': 'Angular',
    en: 'Angular',
  },
  vue: {
    'zh-TW': 'Vue',
    en: 'Vue',
  },
  nextjs: {
    'zh-TW': 'Next.js',
    en: 'Next.js',
  },
} as const;

