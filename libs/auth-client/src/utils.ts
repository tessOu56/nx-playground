/**
 * Jump to the organizer auth app (Kratos UI on :3004).
 */
export function redirectToSSO(
  ssoUrl = 'http://localhost:3004/login',
  returnTo?: string,
) {
  if (typeof window === 'undefined') return;

  const targetUrl = returnTo ?? window.location.href;
  const encodedReturnTo = encodeURIComponent(targetUrl);
  const separator = ssoUrl.includes('?') ? '&' : '?';
  window.location.href = `${ssoUrl}${separator}return_to=${encodedReturnTo}`;
}

export function getReturnToFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('return_to');
}

export function clearReturnToFromUrl() {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('return_to');
  window.history.replaceState({}, '', url.toString());
}
