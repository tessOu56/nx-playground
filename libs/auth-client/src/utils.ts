/**
 * 跳轉到 SSO 站台
 * @param ssoUrl SSO 站台網址
 * @param returnTo 登入成功後要跳轉的網址
 */
export function redirectToSSO(
  ssoUrl = 'https://auth.nx-playground.local',
  returnTo?: string
) {
  if (typeof window === 'undefined') return;

  const targetUrl = returnTo ?? window.location.href;
  const encodedReturnTo = encodeURIComponent(targetUrl);
  const redirectUrl = `${ssoUrl}?return_to=${encodedReturnTo}`;

  window.location.href = redirectUrl;
}

/**
 * 從 URL 參數中取得 return_to 值
 */
export function getReturnToFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('return_to');
}

/**
 * 清除 URL 中的 return_to 參數
 */
export function clearReturnToFromUrl() {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('return_to');
  window.history.replaceState({}, '', url.toString());
}
