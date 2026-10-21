'use client';

import { passkeyClient } from '@better-auth/passkey/client';
import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

function authClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

export const authClient = createAuthClient({
  baseURL: authClientBaseUrl(),
  plugins: [jwtClient(), passkeyClient()],
});
