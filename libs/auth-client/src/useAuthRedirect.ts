import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Redirect unauthenticated organizers to the auth app (Kratos UI).
 * Attendee LIFF is event-portal (T-226), not this path.
 */
export function useAuthRedirect(
  isAuthenticated: boolean,
  ssoUrl = 'http://localhost:3004/login',
  isLoading = false,
) {
  const location = useLocation();

  useEffect(() => {
    if (isLoading || isAuthenticated || typeof window === 'undefined') return;
    const returnTo = encodeURIComponent(window.location.href);
    const separator = ssoUrl.includes('?') ? '&' : '?';
    window.location.href = `${ssoUrl}${separator}return_to=${returnTo}`;
  }, [isAuthenticated, isLoading, ssoUrl, location]);
}
