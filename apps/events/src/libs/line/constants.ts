// LINE 專用常數配置
export const LINE_CONSTANTS = {
  // LIFF 配置
  LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID || '2007835339-AmngJedQ',

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
