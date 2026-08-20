import { ProtectedRoute } from '@nx-playground/auth-client';
import { type ReactNode } from 'react';

const AUTH_APP_URL = (
  (typeof process !== 'undefined' && process.env.VITE_AUTH_APP_URL) ||
  'http://localhost:3004'
).replace(/\/$/, '');

export function OrganizerGate({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute
      ssoUrl={`${AUTH_APP_URL}/login`}
      fallback={
        <p className='p-6 text-sm text-text-secondary'>
          Redirecting to organizer login…
        </p>
      }
    >
      {children}
    </ProtectedRoute>
  );
}
