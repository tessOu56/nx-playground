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
  ssoUrl = 'https://auth.nx-playground.local',
  fallback = null,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  useAuthRedirect(isAuthenticated, ssoUrl);

  if (!isAuthenticated) {
    return fallback;
  }

  return children;
}
