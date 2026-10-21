import { ProtectedRoute } from '@nx-playground/auth-client';
import { type ReactNode } from 'react';

const AUTH_URL = (
  (typeof process !== 'undefined' && process.env.VITE_AUTH_URL) ||
  'http://localhost:3000'
).replace(/\/$/, '');

export function OrganizerGate({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute
      ssoUrl={`${AUTH_URL}/zh-TW/login`}
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
