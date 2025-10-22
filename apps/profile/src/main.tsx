import { Buffer } from 'buffer';
import { themeManager } from '@nx-playground/design-system';
import { i18n } from '@nx-playground/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

globalThis.Buffer = Buffer;

import App from './App';
import { appsI18n } from './features/apps/i18n';
import { blogsI18n } from './features/blogs';
import { detailI18n } from './features/detail';
import { homeI18n } from './features/home';
import { libsI18n } from './features/libs/i18n';
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
layoutI18n.init();
homeI18n.init();
detailI18n.init();
blogsI18n.init();
appsI18n.init();
libsI18n.init();

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
