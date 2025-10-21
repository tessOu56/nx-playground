import { themeManager } from '@nx-playground/design-system';
import { i18n } from '@nx-playground/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { blogI18n } from './features/blog';
import { homeI18n } from './features/home';
import './index.css';

// Initialize theme manager
themeManager.setTheme(themeManager.getCurrentTheme());

// Initialize i18n with all feature namespaces
i18n.init();

// Initialize feature i18n instances (only blog and home need translations)
homeI18n.init();
blogI18n.init();

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
