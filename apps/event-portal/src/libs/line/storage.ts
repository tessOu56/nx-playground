// LINE 本地存儲管理
import { LINE_CONSTANTS } from './constants';

// 從 localStorage 恢復 LIFF 狀態
export const restoreLiffState = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;

    const savedState = localStorage.getItem(LINE_CONSTANTS.LIFF_STATE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      const now = Date.now();

      // 檢查狀態是否過期（24小時）
      if (state.timestamp && now - state.timestamp < 24 * 60 * 60 * 1000) {
        return state.initialized;
      }
    }
  } catch (error) {}
  return false;
};

// 保存 LIFF 狀態到 localStorage
export const saveLiffState = (initialized: boolean): void => {
  try {
    if (typeof window === 'undefined') return;

    const state = {
      initialized,
      timestamp: Date.now(),
    };
    localStorage.setItem(LINE_CONSTANTS.LIFF_STATE_KEY, JSON.stringify(state));
  } catch (error) {}
};

/** Profile cache only — never persist LINE access/id tokens (TM-005). */
export function publicUserInfo<T extends Record<string, unknown>>(
  userInfo: T
): T {
  return {
    ...userInfo,
    idToken: null,
    accessToken: null,
  };
}

// 保存用戶資訊到 localStorage
export const saveUserInfo = (userInfo: any): void => {
  try {
    if (typeof window === 'undefined') return;

    const data = {
      userInfo: publicUserInfo(userInfo ?? {}),
      timestamp: Date.now(),
    };
    localStorage.setItem(
      LINE_CONSTANTS.LIFF_USER_INFO_KEY,
      JSON.stringify(data)
    );
  } catch (error) {}
};

// 從 localStorage 恢復用戶資訊
export const restoreUserInfo = (): any => {
  try {
    if (typeof window === 'undefined') return null;

    const savedData = localStorage.getItem(LINE_CONSTANTS.LIFF_USER_INFO_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      const now = Date.now();

      // 檢查用戶資訊是否過期（1小時）
      if (data.timestamp && now - data.timestamp < 60 * 60 * 1000) {
        const userInfo = data.userInfo;
        if (!userInfo || typeof userInfo !== 'object') return null;
        return publicUserInfo(userInfo);
      }
    }
  } catch (error) {}
  return null;
};

// 清除本地存儲的 LIFF 狀態
export const clearLiffState = (): void => {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(LINE_CONSTANTS.LIFF_STATE_KEY);
    localStorage.removeItem(LINE_CONSTANTS.LIFF_USER_INFO_KEY);
  } catch (error) {}
};

type LineLoginSession = {
  state: string;
  codeVerifier?: string;
};

function readLineLoginSession(): LineLoginSession | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('line_login_state');
    if (!raw) return null;
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw) as { state?: unknown; codeVerifier?: unknown };
      if (typeof parsed.state !== 'string' || !parsed.state) return null;
      return {
        state: parsed.state,
        codeVerifier:
          typeof parsed.codeVerifier === 'string'
            ? parsed.codeVerifier
            : undefined,
      };
    }
    return { state: raw };
  } catch {
    return null;
  }
}

export const saveLineLoginState = (
  state: string,
  codeVerifier?: string
): void => {
  try {
    if (typeof window === 'undefined') return;
    const session: LineLoginSession = { state };
    if (codeVerifier) session.codeVerifier = codeVerifier;
    localStorage.setItem('line_login_state', JSON.stringify(session));
  } catch {
    throw new Error('無法保存登入狀態');
  }
};

export const getLineLoginState = (): string | null => {
  return readLineLoginSession()?.state ?? null;
};

export const getLineLoginCodeVerifier = (): string | null => {
  return readLineLoginSession()?.codeVerifier ?? null;
};

// 清除 LINE 登入 state
export const clearLineLoginState = (): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('line_login_state');
  } catch (error) {}
};

// 標記回調已處理
export const markCallbackProcessed = (state: string): void => {
  try {
    if (typeof window === 'undefined') return;
    const processedKey = `line_callback_processed_${state}`;
    localStorage.setItem(processedKey, 'true');
  } catch (error) {}
};

// 檢查回調是否已處理
export const isCallbackProcessed = (state: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const processedKey = `line_callback_processed_${state}`;
    return !!localStorage.getItem(processedKey);
  } catch (error) {
    return false;
  }
};
