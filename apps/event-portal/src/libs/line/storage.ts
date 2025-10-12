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

// 保存用戶資訊到 localStorage
export const saveUserInfo = (userInfo: any): void => {
  try {
    if (typeof window === 'undefined') return;

    const data = {
      userInfo,
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
        return data.userInfo;
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

// 保存 LINE 登入 state
export const saveLineLoginState = (state: string): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('line_login_state', state);
  } catch (error) {
    throw new Error('無法保存登入狀態');
  }
};

// 獲取 LINE 登入 state
export const getLineLoginState = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('line_login_state');
  } catch (error) {
    return null;
  }
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
