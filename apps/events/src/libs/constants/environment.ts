// 環境變數配置
export const ENV_CONFIG = {
  // API 相關
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.nx-playground.local',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '10000', 10),

  // LINE 相關（基本配置，詳細配置在 lib/line/constants.ts）
  LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID ?? '2007835339-AmngJedQ',
  LINE_CLIENT_ID: process.env.NEXT_PUBLIC_LINE_CLIENT_ID ?? '2007835339',
  LINE_REDIRECT_URI:
    process.env.NEXT_PUBLIC_LINE_REDIRECT_URI ?? 'https://frontend.oosa.life',

  // 域名相關
  PRODUCTION_DOMAIN:
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ?? 'https://frontend.oosa.life',
  DEVELOPMENT_DOMAIN:
    process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN ?? 'http://localhost:3000',

  // 功能開關
  ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
  ENABLE_MOCK_DATA: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false', // 預設啟用

  // 其他配置
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'NX Playground Events',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
} as const;

// 環境檢查函數
export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isTest = () => process.env.NODE_ENV === 'test';

// API 配置
export const API_CONFIG = {
  baseURL: ENV_CONFIG.API_BASE_URL,
  timeout: ENV_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// LINE 基本配置（詳細配置在 lib/line/constants.ts）
export const LINE_CONFIG = {
  liffId: ENV_CONFIG.LIFF_ID,
  clientId: ENV_CONFIG.LINE_CLIENT_ID,
  redirectUri: ENV_CONFIG.LINE_REDIRECT_URI,
  scope: 'profile openid',
} as const;
