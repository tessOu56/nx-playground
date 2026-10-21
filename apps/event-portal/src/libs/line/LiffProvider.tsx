'use client';

import { logger } from '@nx-playground/logger';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
} from 'react';

import { authClient } from '../auth/auth-client';
import { extractLocale } from '../i18n/localeRoutes';

import { lineLogin, lineLogout, isLiffEnvironment } from './auth';
import {
  initializeLiff,
  getLiffContext,
  isLiffInitialized,
} from './liff';
import {
  saveLineLoginReturnPath,
  takeLineLoginReturnPath,
} from './login-return';
import { clearLiffState } from './storage';

import type { LiffUserInfo, LiffContextType } from '@/types';

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const useLiff = (): LiffContextType => {
  const context = useContext(LiffContext);
  if (!context) {
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

function userInfoFromSession(session: {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    lineId?: string | null;
  };
}): LiffUserInfo {
  const lineId = session.user.lineId ?? null;
  return {
    profile: {
      userId: lineId ?? session.user.id,
      displayName: session.user.name ?? '',
      pictureUrl: session.user.image ?? undefined,
    },
    lineId,
  };
}

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

  const initRef = useRef(false);

  useEffect(() => {
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
        if (finalState.isInClient && !isLiffInitialized()) {
          const liffSuccess = await initializeLiff();
          if (liffSuccess) {
            finalState.context = await getLiffContext();
          }
        }

        let { data } = await authClient.getSession();
        if (!data?.user && finalState.isInClient) {
          try {
            await lineLogin();
            ({ data } = await authClient.getSession());
          } catch (error) {
            logger.warn('LIFF Better Auth sign-in skipped', {
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }

        finalState.isInitialized = true;
        if (data?.user) {
          const userInfo = userInfoFromSession(data);
          finalState.isLoggedIn = true;
          finalState.userInfo = userInfo;
          finalState.profile = userInfo.profile;
          finalState.lineId = userInfo.lineId;
        }

        setLiffState(prev => ({
          ...prev,
          ...finalState,
        }));

        if (data?.user) {
          const locale = extractLocale(window.location.pathname) ?? 'zh-TW';
          const returnPath = takeLineLoginReturnPath(locale);
          if (returnPath !== window.location.pathname) {
            window.location.replace(returnPath);
          }
        }
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

  const handleLogin = async () => {
    try {
      saveLineLoginReturnPath(window.location.pathname);
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
