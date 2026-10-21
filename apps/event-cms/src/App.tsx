import { QueryProvider } from '@nx-playground/api-client';
import { AuthProvider } from '@nx-playground/auth-client';
import { I18nProvider } from '@nx-playground/i18n';
import { ToastProvider } from '@nx-playground/ui-components';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

const AUTH_URL =
  (typeof process !== 'undefined' && process.env.VITE_AUTH_URL) ||
  'http://localhost:3000';

function App() {
  return (
    <I18nProvider>
      <AuthProvider authUrl={AUTH_URL}>
        <QueryProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </QueryProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
