export function getKratosPublicUrl(): string {
  const fromEnv =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_ORY_PUBLIC_API) ||
    'http://localhost:4433';
  return String(fromEnv).replace(/\/$/, '');
}

/** Kratos public origin used by the auth UI on :3004. */
export function handleDomain() {
  return getKratosPublicUrl();
}

export function startKratosBrowserFlow(
  flow: 'login' | 'registration',
  returnTo?: string,
) {
  const kratos = getKratosPublicUrl();
  const target =
    returnTo ||
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('return_to')
      : null) ||
    'http://localhost:3002/events';
  const url = `${kratos}/self-service/${flow}/browser?return_to=${encodeURIComponent(target)}`;
  window.location.replace(url);
}
