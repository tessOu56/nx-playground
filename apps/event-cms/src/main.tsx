import { themeManager } from '@nx-playground/design-system';
import { i18n } from '@nx-playground/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import * as App from './App';

import './index.css';

// Initialize theme manager
themeManager.setTheme(themeManager.getCurrentTheme());

// Initialize i18n
i18n.init();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <HelmetProvider>
        <App.default />
      </HelmetProvider>
    </StrictMode>
  );
}
