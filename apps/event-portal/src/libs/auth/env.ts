export const AUTH_JWT_AUDIENCE = 'event-stack-api';

function ownerLineClientId(): string {
  const value = process.env.NEXT_PUBLIC_LINE_CLIENT_ID?.trim() ?? '';
  if (!value || value === '2007835339') return '';
  return value;
}

function ownerLineClientSecret(): string {
  const value = process.env.LINE_CLIENT_SECRET?.trim() ?? '';
  if (
    !value ||
    value === 'your_line_client_secret_here' ||
    value === 'your_line_client_secret'
  ) {
    return '';
  }
  return value;
}

export function betterAuthBaseUrl(): string {
  return (
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

export function betterAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  if (secret) return secret;
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    throw new Error('BETTER_AUTH_SECRET is required');
  }
  return 'dev-only-better-auth-secret-change-me';
}

export function lineTwCredentials(): {
  clientId: string;
  clientSecret: string;
} | null {
  const clientId = ownerLineClientId();
  const clientSecret = ownerLineClientSecret();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function googleCredentials(): {
  clientId: string;
  clientSecret: string;
} | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? '';
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function betterAuthTrustedOrigins(): string[] {
  const extra = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
  return Array.from(
    new Set([
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3004',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3002',
      'https://nx-event-portal.vercel.app',
      betterAuthBaseUrl(),
      ...extra,
    ])
  );
}
