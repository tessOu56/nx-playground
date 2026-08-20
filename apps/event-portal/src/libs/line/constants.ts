/** Leftover public IDs from another org — never use as product defaults. */
const LEFTOVER_LIFF_IDS = new Set(['2007835339-AmngJedQ']);
const LEFTOVER_CHANNEL_IDS = new Set(['2007835339']);

function ownerEnv(
  value: string | undefined,
  leftovers: Set<string>
): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || leftovers.has(trimmed)) return '';
  return trimmed;
}

export const OWNER_LIFF_ID = ownerEnv(
  process.env.NEXT_PUBLIC_LIFF_ID,
  LEFTOVER_LIFF_IDS
);
export const OWNER_LINE_CLIENT_ID = ownerEnv(
  process.env.NEXT_PUBLIC_LINE_CLIENT_ID,
  LEFTOVER_CHANNEL_IDS
);
export const OWNER_LINE_PROVIDER_ID =
  process.env.NEXT_PUBLIC_LINE_PROVIDER_ID?.trim() ?? '';
export const OWNER_LIFF_URL = process.env.NEXT_PUBLIC_LIFF_URL?.trim() ?? '';

export function hasOwnerLiffId(): boolean {
  return OWNER_LIFF_ID.length > 0;
}

export function hasOwnerLineLogin(): boolean {
  return OWNER_LINE_CLIENT_ID.length > 0;
}

export function canStartLineLogin(): boolean {
  return hasOwnerLineLogin() || hasOwnerLiffId();
}

/**
 * LINE Login `redirect_uri`. Hosted demo must not send localhost when the
 * page is on Vercel — LINE Developers callback must still allowlist this origin.
 */
export function getLineRedirectUri(
  location?: {
    protocol: string;
    hostname: string;
    origin: string;
  },
  configuredEnv = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI
): string {
  const configured = configuredEnv?.trim() ?? '';
  const loc =
    location ?? (typeof window !== 'undefined' ? window.location : undefined);
  if (loc) {
    const configuredIsLocal =
      !configured || /localhost|127\.0\.0\.1/i.test(configured);
    const pageIsHosted =
      loc.protocol === 'https:' && !/localhost|127\.0\.0\.1/i.test(loc.hostname);
    if (configuredIsLocal && pageIsHosted) {
      return loc.origin;
    }
  }
  return configured || 'http://localhost:3000';
}

export const LINE_LOGIN_NOT_CONFIGURED =
  '此公開示範尚未接 tessOu56 的 LINE Login（STOP-013）。請改從「瀏覽活動」用標示示範身分 user_demo 完成流程。';

// LINE 專用常數配置
export const LINE_CONSTANTS = {
  // LIFF 配置 — owner STOP-013 env
  LIFF_ID: OWNER_LIFF_ID,
  LIFF_URL: OWNER_LIFF_URL,
  PROVIDER_ID: OWNER_LINE_PROVIDER_ID,

  // 官方帳號配置
  OFFICIAL_ACCOUNT_ID: '@your-official-account-id',
  OFFICIAL_ACCOUNT_URL: 'https://line.me/R/ti/p/@your-official-account-id',

  // LINE 分享 URL
  SHARE_URLS: {
    TEXT_MESSAGE: 'https://line.me/R/msg/text/',
    OAUTH_AUTHORIZE: 'https://access.line.me/oauth2/v2.1/authorize',
  },

  // 本地存儲鍵名
  LIFF_STATE_KEY: 'nx-playground_liff_state',
  LIFF_USER_INFO_KEY: 'nx-playground_liff_user_info',

  // 錯誤訊息
  ERRORS: {
    NOT_IN_CLIENT: '請在 LINE 應用中打開此頁面',
    NOT_LOGGED_IN: '請先登入 LINE',
    SHARE_FAILED: '分享失敗，請稍後再試',
    MESSAGE_FAILED: '發送訊息失敗，請稍後再試',
    INIT_FAILED: 'LIFF 初始化失敗',
  },

  // 成功訊息
  SUCCESS: {
    SHARE_SUCCESS: '分享成功',
    MESSAGE_SENT: '訊息已發送到官方帳號',
    LOGIN_SUCCESS: '登入成功',
    LOGOUT_SUCCESS: '登出成功',
  },
} as const;

// LIFF 初始化配置
export const liffConfig = {
  liffId: LINE_CONSTANTS.LIFF_ID,
};
