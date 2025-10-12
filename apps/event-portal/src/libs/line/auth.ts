// LINE 認證服務 - 統一管理
import liff from '@line/liff';

import { LINE_CONSTANTS } from './constants';
import {
  saveLineLoginState,
  getLineLoginState,
  clearLineLoginState,
  markCallbackProcessed,
  isCallbackProcessed,
} from './storage';

// 檢查是否在 LIFF 環境中
export const isLiffEnvironment = (): boolean => {
  try {
    // 在開發環境中，如果是 HTTPS 且不是 localhost，則跳過 LIFF 檢測
    if (typeof window !== 'undefined') {
      const isHttps = window.location.protocol === 'https:';
      const isNotLocalhost = !window.location.hostname.includes('localhost');
      const isDevelopment = process.env.NODE_ENV === 'development';

      if (isHttps && isNotLocalhost && isDevelopment) {
        // 在 HTTPS 開發環境中，暫時跳過 LIFF 檢測以避免安全錯誤
        return false;
      }
    }

    return Boolean(typeof liff?.isInClient());
  } catch (_error) {
    return false;
  }
};

// 檢查是否在 LINE 環境中
export const isLineEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 檢查 URL 參數
  const urlParams = new URLSearchParams(window.location.search);
  const hasLineParams = urlParams.has('code') && urlParams.has('state');

  // 檢查用戶代理
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isLineApp = userAgent.includes('line') || userAgent.includes('liff');

  return hasLineParams || isLineApp;
};

// 獲取 LINE 登入 URL（用於一般瀏覽器）
export const getLineLoginUrl = (): string => {
  if (typeof window === 'undefined') return '';

  // 生成 state
  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36);

  // 保存 state 到 localStorage
  saveLineLoginState(state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_LINE_CLIENT_ID ?? '2007835339',
    redirect_uri:
      process.env.NEXT_PUBLIC_LINE_REDIRECT_URI ?? 'https://frontend.nx-playground.local',
    state,
    scope: 'profile openid',
  });

  return `${LINE_CONSTANTS.SHARE_URLS.OAUTH_AUTHORIZE}?${params.toString()}`;
};

// 統一的 LINE 登入函數
export const lineLogin = (): void => {
  if (isLiffEnvironment()) {
    liff.login();
  } else {
    const loginUrl = getLineLoginUrl();
    window.location.href = loginUrl;
  }
};

// 統一的 LINE 登出函數
export const lineLogout = (): void => {
  if (isLiffEnvironment()) {
    liff.logout();
  } else {
    clearLineLoginState();
    localStorage.removeItem(LINE_CONSTANTS.LIFF_USER_INFO_KEY);
  }
};

// 從 LIFF 獲取完整用戶信息
export const getFullUserInfoFromLiff = async () => {
  try {
    const [profile, idToken, accessToken] = await Promise.all([
      liff.getProfile(),
      liff.getIDToken(),
      liff.getAccessToken(),
    ]);

    const decodedIdToken = idToken ? decodeIdToken(idToken) : null;
    const lineId = decodedIdToken?.sub ?? null;

    const userInfo = {
      profile,
      idToken,
      accessToken,
      decodedIdToken,
      lineId,
    };

    // 保存到本地存儲
    localStorage.setItem(
      LINE_CONSTANTS.LIFF_USER_INFO_KEY,
      JSON.stringify(userInfo)
    );
    return userInfo;
  } catch (_error) {
    return null;
  }
};

// 獲取 LINE 用戶信息
export const getLineUserInfo = async () => {
  try {
    // 1. 檢查是否在 LIFF 環境中
    if (isLiffEnvironment()) {
      return await getFullUserInfoFromLiff();
    }

    // 2. 檢查本地存儲
    const savedUserInfo = localStorage.getItem(
      LINE_CONSTANTS.LIFF_USER_INFO_KEY
    );
    if (savedUserInfo) {
      try {
        return JSON.parse(savedUserInfo);
      } catch (_parseError) {
        localStorage.removeItem(LINE_CONSTANTS.LIFF_USER_INFO_KEY);
      }
    }

    // 3. 檢查是否有 LINE 登入回調
    try {
      const callbackUserInfo = await handleLineCallback();
      if (callbackUserInfo) {
        return callbackUserInfo;
      }
    } catch (_callbackError) {
      console.error(_callbackError);
    }

    return null;
  } catch (_error) {
    return null;
  }
};

// 處理 LINE 登入回調
export const handleLineCallback = async () => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (error) {
    throw new Error(`LINE 登入失敗: ${error}`);
  }

  if (!code || !state) {
    return null;
  }

  // 檢查是否已經處理過
  if (isCallbackProcessed(state)) {
    return null;
  }

  // 檢查已存在的用戶信息
  const existingUserInfo = localStorage.getItem(
    LINE_CONSTANTS.LIFF_USER_INFO_KEY
  );
  if (existingUserInfo) {
    markCallbackProcessed(state);
    return JSON.parse(existingUserInfo);
  }

  // 驗證 state
  const savedState = getLineLoginState();
  if (!savedState || state !== savedState) {
    if (existingUserInfo) {
      markCallbackProcessed(state);
      return JSON.parse(existingUserInfo);
    }
    throw new Error('State 驗證失敗');
  }

  markCallbackProcessed(state);

  try {
    const currentPath = window.location.pathname;
    const isP01Page = currentPath === '/' || currentPath === '/home';

    if (isP01Page) {
      // P01 頁面：優先使用 LIFF SDK
      if (liff?.isInClient()) {
        return await getFullUserInfoFromLiff();
      }

      // 使用後端 API 處理 OAuth 流程
      const tokenResponse = await fetch('/api/line/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          redirect_uri:
            process.env.NEXT_PUBLIC_LINE_REDIRECT_URI ??
            'https://frontend.nx-playground.local',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('獲取 access token 失敗');
      }

      const tokenData = await tokenResponse.json();
      const realUserInfo = {
        profile: tokenData.profile,
        idToken: tokenData.idToken,
        accessToken: tokenData.accessToken,
        decodedIdToken: tokenData.decodedIdToken,
        lineId: tokenData.lineId,
        tokenType: tokenData.tokenType,
        expiresIn: tokenData.expiresIn,
        refreshToken: tokenData.refreshToken,
      };

      localStorage.setItem(
        LINE_CONSTANTS.LIFF_USER_INFO_KEY,
        JSON.stringify(realUserInfo)
      );
      clearLineLoginState();
      return realUserInfo;
    } else {
      // 其他頁面：使用 mock 數據
      // 使用 mock 用戶資料
      const { getFullUserInfoByLineId } = await import('../mock/users');
      const mockLineId = 'U1234567890abcdef1234567890abcdef1'; // 張小明的 LINE ID
      const mockUser = getFullUserInfoByLineId(mockLineId);

      const mockUserInfo = {
        profile: {
          userId: mockLineId,
          displayName:
            mockUser?.lineInfo?.profile?.displayName ?? 'Mock LINE 用戶',
          pictureUrl:
            mockUser?.lineInfo?.profile?.pictureUrl ??
            'https://via.placeholder.com/150',
          statusMessage:
            mockUser?.lineInfo?.profile?.statusMessage ?? 'Mock 用戶狀態',
        },
        idToken: `mock_id_token_${Date.now()}`,
        accessToken: `mock_access_token_${Date.now()}`,
        decodedIdToken: {
          sub: mockLineId,
          name: mockUser?.name ?? 'Mock LINE 用戶',
          picture:
            mockUser?.lineInfo?.profile?.pictureUrl ??
            'https://via.placeholder.com/150',
        },
        lineId: mockLineId,
      };

      clearLineLoginState();
      return mockUserInfo;
    }
  } catch (error) {
    clearLineLoginState();
    throw error;
  }
};

// 輔助函數：解析 ID Token
function decodeIdToken(idToken: string) {
  try {
    const [, payload] = idToken.split('.');
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch (_error) {
    return null;
  }
}
