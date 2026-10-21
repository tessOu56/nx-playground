// LINE 認證服務 - 統一管理
import liff from '@line/liff';

import {
  LINE_CONSTANTS,
  LINE_LOGIN_NOT_CONFIGURED,
  OWNER_LINE_CLIENT_ID,
  getLineRedirectUri,
  hasOwnerLineLogin,
} from './constants';
import { createLineLoginPkce } from './pkce';
import {
  saveLineLoginState,
  getLineLoginState,
  getLineLoginCodeVerifier,
  clearLineLoginState,
  markCallbackProcessed,
  isCallbackProcessed,
  publicUserInfo,
  saveUserInfo,
} from './storage';
import { isLineLoginCancelledError } from './login-return';
import { verifyLiffIdToken } from './verify-id-token-client';

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

export const getLineLoginUrl = async (): Promise<string> => {
  if (typeof window === 'undefined' || !hasOwnerLineLogin()) return '';

  const { state, codeVerifier, codeChallenge } = await createLineLoginPkce();
  saveLineLoginState(state, codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OWNER_LINE_CLIENT_ID,
    redirect_uri: getLineRedirectUri(),
    state,
    scope: 'profile openid',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${LINE_CONSTANTS.SHARE_URLS.OAUTH_AUTHORIZE}?${params.toString()}`;
};

export const lineLogin = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  if (isLiffEnvironment()) {
    liff.login();
    return;
  }

  const loginUrl = await getLineLoginUrl();
  if (!loginUrl) {
    throw new Error(LINE_LOGIN_NOT_CONFIGURED);
  }
  window.location.href = loginUrl;
};

export async function fetchLineServerSession() {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch('/api/line/auth/session', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as Record<string, unknown>;
    if (typeof body.lineId !== 'string' || !body.lineId) return null;
    return publicUserInfo(body);
  } catch {
    return null;
  }
}

async function establishLineServerSession(tokens: {
  idToken: string;
  accessToken: string;
}) {
  const response = await fetch('/api/line/auth/session', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as Record<string, unknown>;
  if (typeof body.lineId !== 'string' || !body.lineId) return null;
  return publicUserInfo(body);
}

async function clearLineServerSession() {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/line/auth/session', {
      method: 'DELETE',
      credentials: 'same-origin',
    });
  } catch {
    // Cookie clear is best-effort; local profile cache is still wiped.
  }
}

// 統一的 LINE 登出函數
export const lineLogout = async (): Promise<void> => {
  try {
    if (isLiffEnvironment()) {
      liff.logout();
    }
  } catch {
    // LIFF 未初始化時仍清掉本機 OAuth session
  }
  await clearLineServerSession();
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

    if (!idToken) return null;
    const decodedIdToken = await verifyLiffIdToken(idToken);
    if (!decodedIdToken) return null;
    const lineId = decodedIdToken.sub;

    const session = accessToken
      ? await establishLineServerSession({ idToken, accessToken })
      : null;
    const userInfo = publicUserInfo({
      profile,
      decodedIdToken,
      lineId,
      ...(session ?? {}),
    });
    saveUserInfo(userInfo);
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

    const serverSession = await fetchLineServerSession();
    if (serverSession) return serverSession;

    // 2. 檢查本地存儲（profile only; tokens are stripped）
    const savedUserInfo = localStorage.getItem(
      LINE_CONSTANTS.LIFF_USER_INFO_KEY
    );
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        const nested = parsed?.userInfo ?? parsed;
        if (nested && typeof nested === 'object') {
          return publicUserInfo(nested);
        }
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

  if (isLineLoginCancelledError(error)) {
    return null;
  }
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

  const existingSession = await fetchLineServerSession();
  if (existingSession) {
    markCallbackProcessed(state);
    return existingSession;
  }

  // 驗證 state
  const savedState = getLineLoginState();
  if (!savedState || state !== savedState) {
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

    const codeVerifier = getLineLoginCodeVerifier();
    if (!codeVerifier) {
      throw new Error('State 驗證失敗');
    }

    const tokenResponse = await fetch('/api/line/auth/token', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('獲取 access token 失敗');
    }

    const tokenData = (await tokenResponse.json()) as Record<string, unknown>;
    const realUserInfo = publicUserInfo({
      profile: tokenData.profile,
      decodedIdToken: tokenData.decodedIdToken,
      lineId: tokenData.lineId,
      tokenType: tokenData.tokenType,
      expiresIn: tokenData.expiresIn,
    });

    saveUserInfo(realUserInfo);
    clearLineLoginState();
    return realUserInfo;
  } catch (error) {
    clearLineLoginState();
    throw error;
  }
};

