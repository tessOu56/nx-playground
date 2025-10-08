export function handleDomain() {
  const { hostname, origin } = window.location;

  const devHosts = ['localhost', '127.0.0.1', 'frontend.oosa.life'];

  // 若符合開發或 staging 的條件，統一導向 sso service
  if (devHosts.includes(hostname)) {
    return 'https://sso-frontend-dev.oosa.life/api';
  }

  // 預設回 fallback 的 API proxy 路徑
  return `${origin}/api`;
}
