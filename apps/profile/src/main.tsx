import { themeManager } from '@nx-playground/design-system';
import { i18n } from '@nx-playground/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { blogsI18n } from './features/blogs';
import { detailI18n } from './features/detail';
import { homeI18n } from './features/home';
import './index.css';

// Initialize theme manager
themeManager.setTheme(themeManager.getCurrentTheme());

// Initialize i18n with all feature namespaces
i18n.init();

// Initialize feature i18n instances (blogs, detail, home need translations)
homeI18n.init();
detailI18n.init();
blogsI18n.init();

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
