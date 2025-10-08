import { QueryProvider } from '@nx-playground/api-client';
import { AuthProvider } from '@nx-playground/auth-client';
import { I18nProvider } from '@nx-playground/i18n';
import { ToastProvider } from '@nx-playground/ui-components';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
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
