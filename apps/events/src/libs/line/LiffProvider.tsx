'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
} from 'react';

import {
  lineLogin,
  lineLogout,
  getLineUserInfo,
  isLiffEnvironment,
  handleLineCallback,
} from './auth';
import {
  initializeLiff,
  getLiffContext,
  getFullUserInfo,
  isLiffInitialized,
} from './liff';
import { saveUserInfo, restoreUserInfo, clearLiffState } from './storage';

import type { LiffUserInfo, LiffContextType } from '@/types';

// 創建 LIFF Context
// 由於檔案開頭有 'use client'，這個操作只會在客戶端執行，不會有 SSR 錯誤
const LiffContext = createContext<LiffContextType | undefined>(undefined);

// 方便的 Hooks 讓子元件能使用 LIFF 狀態
export const useLiff = (): LiffContextType => {
  const context = useContext(LiffContext);
  if (!context) {
    // 雖然 `useLiff` 應該被 `LiffProvider` 包裹，
    // 但為了安全，如果沒有 Provider，仍返回預設值。
    return {
      isInitialized: false,
      isInClient: false,
      isLoggedIn: false,
      profile: null,
      userInfo: null,
      lineId: null,
      context: null,
      error: null,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
};

interface LiffProviderProps {
  children: ReactNode;
}

export const LiffProvider: FC<LiffProviderProps> = ({ children }) => {
  const [liffState, setLiffState] = useState<LiffContextType>({
    isInitialized: false,
    isInClient: false,
    isLoggedIn: false,
    profile: null,
    userInfo: null,
    lineId: null,
    context: null,
    error: null,
    login: () => {},
    logout: () => {},
  });

  // 使用 ref 來追蹤初始化狀態，避免重複初始化
  const initRef = useRef(false);

  // 初始化 LIFF 相關邏輯
  useEffect(() => {
    // 確保程式碼只在客戶端運行一次
    if (initRef.current || typeof window === 'undefined') {
      return;
    }

    const initLiffAuth = async () => {
      initRef.current = true;
      const finalState: Partial<LiffContextType> = {
        isInitialized: false,
        isInClient: isLiffEnvironment(),
        isLoggedIn: false,
        profile: null,
        userInfo: null,
        lineId: null,
        context: null,
        error: null,
      };

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasCallback = urlParams.has('code') && urlParams.has('state');

        let userInfo: LiffUserInfo | null = null;
        let liffContext = null;

        // 步驟 1: 優先處理 LINE 登入回調
        if (hasCallback) {
          try {
            userInfo = await handleLineCallback();
          } catch (callbackError) {
            console.warn(
              '處理 LINE 登入回調失敗，可能是頁面導航觸發的:',
              callbackError
            );
          }
        }

        // 步驟 2: 如果回調失敗或不存在，嘗試從 LIFF 環境或本地儲存獲取資訊
        if (!userInfo) {
          if (finalState.isInClient && !isLiffInitialized()) {
            const liffSuccess = await initializeLiff();
            if (liffSuccess) {
              liffContext = await getLiffContext();
              if (liffContext?.isLoggedIn) {
                userInfo = await getFullUserInfo();
              }
            }
          } else {
            // 非 LIFF 環境，從本地儲存恢復資訊
            userInfo = restoreUserInfo();
          }
        }

        // 步驟 3: 統一更新狀態
        if (liffContext) {
          finalState.isInitialized = true;
          finalState.isLoggedIn = liffContext.isLoggedIn;
          finalState.context = liffContext;
        } else {
          finalState.isInitialized = true;
          finalState.isLoggedIn = !!userInfo;
        }

        if (userInfo) {
          finalState.profile = userInfo.profile;
          finalState.userInfo = userInfo;
          finalState.lineId = userInfo.lineId;
          saveUserInfo(userInfo);
        }

        setLiffState(prev => ({
          ...prev,
          ...finalState,
        }));
      } catch (error) {
        setLiffState(prev => ({
          ...prev,
          error: (error as Error).message,
          isInitialized: true,
        }));
      }
    };

    initLiffAuth();
  }, []);

  // 登入與登出處理函數
  const handleLogin = async () => {
    try {
      await lineLogin();
    } catch (error) {
      setLiffState(prev => ({ ...prev, error: (error as Error).message }));
    }
  };

  const handleLogout = async () => {
    try {
      await lineLogout();
      setLiffState(prev => ({
        ...prev,
        isLoggedIn: false,
        profile: null,
        userInfo: null,
        lineId: null,
        context: null,
      }));
      clearLiffState();
    } catch (error) {
      setLiffState(prev => ({ ...prev, error: (error as Error).message }));
    }
  };

  return (
    <LiffContext.Provider
      value={{
        ...liffState,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};
