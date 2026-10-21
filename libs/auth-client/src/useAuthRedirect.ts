import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Redirect unauthenticated organizers to event-portal Better Auth login.
 * Attendee LIFF is event-portal, not this path.
 */
export function useAuthRedirect(
  isAuthenticated: boolean,
  ssoUrl = 'http://localhost:3000/zh-TW/login',
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
