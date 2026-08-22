import { setEventStackOrganizerAuth } from '@nx-playground/api-client';
import { useAuth } from '@nx-playground/auth-client';
import { useEffect } from 'react';

const cmsBearerToken =
  typeof process !== 'undefined'
    ? process.env.VITE_CMS_ORGANIZER_API_TOKEN?.trim()
    : undefined;

/**
 * Forwards organizer identity to Nest protected routes (users, stats).
 */
export function OrganizerApiAuthSync() {
  const { user } = useAuth();

  useEffect(() => {
    setEventStackOrganizerAuth({
      email: user?.email ?? null,
      bearerToken: cmsBearerToken ?? null,
    });
  }, [user?.email]);

  return null;
}
