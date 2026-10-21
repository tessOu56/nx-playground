export function getPortalAuthUrl(): string {
  const fromEnv =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_AUTH_URL) ||
    'http://localhost:3000';
  return String(fromEnv).replace(/\/$/, '');
}

export function portalLoginUrl(returnTo?: string): string {
  const portal = getPortalAuthUrl();
  const target =
    returnTo ||
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('return_to')
      : null) ||
    'http://localhost:3002/events';
  return `${portal}/zh-TW/login?return_to=${encodeURIComponent(target)}`;
}

export function redirectToPortalLogin(returnTo?: string): void {
  window.location.replace(portalLoginUrl(returnTo));
}
