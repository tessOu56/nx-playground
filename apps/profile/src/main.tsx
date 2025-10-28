import { Buffer } from 'buffer';
import { initAnalytics } from '@nx-playground/analytics';
import { themeManager } from '@nx-playground/design-system';
import { i18n } from '@nx-playground/i18n';
import { logger } from '@nx-playground/logger';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

globalThis.Buffer = Buffer;

import App from './App';
import blogsI18n from './features/blogs/i18n';
import homeI18n from './features/home/i18n';
import projectsI18n from './features/projects/i18n';
import layoutI18n from './components/layout/i18n';
import './index.css';

// Initialize logger with app context
logger.setContext({
  app: 'profile',
  version: '1.0.0',
  environment: import.meta.env.MODE,
});

logger.info('Profile app initializing');

// Initialize analytics
initAnalytics({
  provider:
    (import.meta.env.VITE_ANALYTICS_PROVIDER as 'ga4' | 'plausible' | 'none') ||
    'none',
  measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
  debug: import.meta.env.MODE === 'development',
});

logger.info('Analytics initialized', {
  provider: import.meta.env.VITE_ANALYTICS_PROVIDER || 'none',
});

// Initialize theme manager
themeManager.setTheme(themeManager.getCurrentTheme());

// Initialize i18n with all feature namespaces
i18n.init();

// Get initial locale from URL
const initialMatch = window.location.pathname.match(/^\/(zh-TW|en)/);
const initialLocale = initialMatch?.[1] || 'en';

// Force set initial language to match URL or default to 'en'
if (i18n.language !== initialLocale) {
  i18n.changeLanguage(initialLocale);
}

// Initialize feature i18n instances
// The createFeatureI18n already registers resources, no need for .init() calls
// Note: detailI18n is now merged into projectsI18n
layoutI18n.init();
homeI18n.init();
blogsI18n.init();
projectsI18n.init();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        logger.info('Service worker registered', {
          scope: registration.scope,
        });
      })
      .catch(error => {
        logger.error('Service worker registration failed', error);
      });
  });
}

logger.info('Profile app ready');
