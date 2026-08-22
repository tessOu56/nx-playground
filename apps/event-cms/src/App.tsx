import { QueryProvider } from '@nx-playground/api-client';
import { AuthProvider } from '@nx-playground/auth-client';
import { I18nProvider } from '@nx-playground/i18n';
import { ToastProvider } from '@nx-playground/ui-components';
import { RouterProvider } from 'react-router-dom';

import { OrganizerApiAuthSync } from './auth/OrganizerApiAuthSync';
import { router } from './router';

const KRATOS_PUBLIC_URL =
  (typeof process !== 'undefined' && process.env.VITE_KRATOS_PUBLIC_URL) ||
  'http://localhost:4433';

function App() {
  return (
    <I18nProvider>
      <AuthProvider kratosPublicUrl={KRATOS_PUBLIC_URL}>
        <OrganizerApiAuthSync />
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
