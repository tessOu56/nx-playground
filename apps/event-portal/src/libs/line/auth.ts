import liff from '@line/liff';

import { authClient } from '../auth/auth-client';
import { LINE_TW_PROVIDER_ID } from '../auth/line-account-map';

import {
  LINE_LOGIN_NOT_CONFIGURED,
  hasOwnerLineLogin,
} from './constants';

export const isLiffEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (typeof liff?.isInClient !== 'function') return false;
    return Boolean(liff.isInClient());
  } catch {
    return false;
  }
};

export const isLineEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('line') || userAgent.includes('liff');
};

async function signInWithLineTw(callbackURL?: string): Promise<void> {
  if (!hasOwnerLineLogin()) {
    throw new Error(LINE_LOGIN_NOT_CONFIGURED);
  }
  await authClient.signIn.social({
    provider: LINE_TW_PROVIDER_ID,
    callbackURL: callbackURL ?? window.location.href,
  });
}

async function signInWithLineIdToken(): Promise<boolean> {
  try {
    const token = liff.getIDToken?.();
    if (!token) return false;
    const accessToken = liff.getAccessToken?.() ?? undefined;
    const result = await authClient.signIn.social({
      provider: LINE_TW_PROVIDER_ID,
      idToken: {
        token,
        accessToken,
      },
    });
    return !result.error;
  } catch {
    return false;
  }
}

export const lineLogin = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  if (isLiffEnvironment()) {
    const signedIn = await signInWithLineIdToken();
    if (signedIn) return;
    liff.login();
    return;
  }

  await signInWithLineTw();
};

export const lineLogout = async (): Promise<void> => {
  try {
    if (isLiffEnvironment()) {
      liff.logout();
    }
  } catch {
    // LIFF may not be initialized.
  }
  await authClient.signOut();
};

export const getLineUserInfo = async () => {
  const { data } = await authClient.getSession();
  const lineId =
    typeof data?.user?.lineId === 'string' ? data.user.lineId : null;
  if (!data?.user) return null;
  return {
    profile: {
      userId: lineId ?? data.user.id,
      displayName: data.user.name ?? '',
      pictureUrl: data.user.image ?? undefined,
    },
    lineId,
  };
};
