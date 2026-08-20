import { type ReactNode } from 'react';

import { useAuth } from './AuthContext';
import { useAuthRedirect } from './useAuthRedirect';

interface ProtectedRouteProps {
  children: ReactNode;
  ssoUrl?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  ssoUrl = 'http://localhost:3004/login',
  fallback = null,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useAuthRedirect(isAuthenticated, ssoUrl, isLoading);

  if (isLoading) {
    return fallback ?? <p>Loading organizer session…</p>;
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return children;
}
