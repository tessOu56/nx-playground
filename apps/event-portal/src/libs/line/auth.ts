// LINE 認證服務 - 統一管理
import liff from '@line/liff';

import {
  LINE_CONSTANTS,
  LINE_LOGIN_NOT_CONFIGURED,
  OWNER_LINE_CLIENT_ID,
  getLineRedirectUri,
  hasOwnerLineLogin,
} from './constants';
import {
  saveLineLoginState,
  getLineLoginState,
  clearLineLoginState,
  markCallbackProcessed,
  isCallbackProcessed,
} from './storage';

// 檢查是否在 LIFF 應用內。必須呼叫 isInClient()；typeof 永遠是非空字串。
export const isLiffEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (typeof liff?.isInClient !== 'function') return false;
    return Boolean(liff.isInClient());
  } catch {
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
  if (typeof window === 'undefined' || !hasOwnerLineLogin()) return '';

  // 生成 state
  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36);

  // 保存 state 到 localStorage
  saveLineLoginState(state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OWNER_LINE_CLIENT_ID,
    redirect_uri: getLineRedirectUri(),
    state,
    scope: 'profile openid',
  });

  return `${LINE_CONSTANTS.SHARE_URLS.OAUTH_AUTHORIZE}?${params.toString()}`;
};

// 統一的 LINE 登入函數
export const lineLogin = (): void => {
  if (typeof window === 'undefined') return;

  if (isLiffEnvironment()) {
    liff.login();
    return;
  }

  const loginUrl = getLineLoginUrl();
  if (!loginUrl) {
    throw new Error(LINE_LOGIN_NOT_CONFIGURED);
  }
  window.location.href = loginUrl;
};

// 統一的 LINE 登出函數
export const lineLogout = (): void => {
  try {
    if (isLiffEnvironment()) {
      liff.logout();
    }
  } catch {
    // LIFF 未初始化時仍清掉本機 OAuth session
  }
  clearLineLoginState();
  localStorage.removeItem(LINE_CONSTANTS.LIFF_USER_INFO_KEY);
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
    } catch (callbackError) {
      console.error('LINE callback error', callbackError);
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
    if (!hasOwnerLineLogin()) {
      return null;
    }

    if (liff?.isInClient()) {
      return await getFullUserInfoFromLiff();
    }

    const tokenResponse = await fetch('/api/line/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri: getLineRedirectUri(),
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
