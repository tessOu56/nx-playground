import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useAuthRedirect
 * @param isAuthenticated 是否已登入
 * @param ssoUrl SSO 站台網址，預設為 apps/auth 部署的站台
 */
export function useAuthRedirect(
  isAuthenticated: boolean,
  ssoUrl = 'https://auth.nx-playground.local'
) {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      // 將當前頁面網址編碼為 return_to 參數
      const returnTo = encodeURIComponent(window.location.href);
      const redirectUrl = `${ssoUrl}?return_to=${returnTo}`;

      // 重定向到 SSO 站台
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, ssoUrl, location]);
}
