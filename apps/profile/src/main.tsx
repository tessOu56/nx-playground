import { Buffer } from 'buffer';
import { themeManager } from '@nx-playground/design-system';
import { i18n } from '@nx-playground/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

globalThis.Buffer = Buffer;

import App from './App';
import blogsI18n from './features/blogs/i18n';
import detailI18n from './features/detail/i18n';
import homeI18n from './features/home/i18n';
import projectsI18n from './features/projects/i18n';
import layoutI18n from './components/layout/i18n';
import './index.css';

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
layoutI18n.init();
homeI18n.init();
detailI18n.init();
blogsI18n.init();
projectsI18n.init();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
