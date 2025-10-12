// 條件導入 LIFF，避免 SSR 問題
import { LINE_CONSTANTS, liffConfig } from './constants';
import { restoreLiffState, saveLiffState } from './storage';

let liff: unknown = null;

// 動態導入 LIFF 模組
const loadLiffModule = async (): Promise<unknown> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const liffModule = await import('@line/liff');
    return liffModule.default || null;
  } catch (error) {
    // 在開發環境中，如果是安全錯誤，則靜默處理
    if (
      process.env.NODE_ENV === 'development' &&
      error instanceof Error &&
      error.name === 'SecurityError'
    ) {
      console.log('LIFF 安全錯誤已忽略（開發環境）');
      return null;
    }
    return null;
  }
};

// 初始化 LIFF 模組
const _initializeLiffModule = async () => {
  if (liff === null) {
    liff = await loadLiffModule();
  }
  return liff;
};

// 全局 LIFF 狀態追蹤
let liffInitialized = false;
let liffInitPromise: Promise<boolean> | null = null;

// 檢查 LIFF 是否可用（內部輔助函數）
const isLiffModuleAvailable = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (liff === null) {
    liff = await loadLiffModule();
  }

  return liff !== null;
};

// LIFF 初始化函數 - 可選初始化，失敗時不阻礙應用運行
export const initializeLiff = async (): Promise<boolean> => {
  // 在開發環境中，如果是 HTTPS 且不是 localhost，則跳過 LIFF 初始化
  if (typeof window !== 'undefined') {
    const isHttps = window.location.protocol === 'https:';
    const isNotLocalhost = !window.location.hostname.includes('localhost');
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isHttps && isNotLocalhost && isDevelopment) {
      // 在 HTTPS 開發環境中，跳過 LIFF 初始化以避免安全錯誤
      console.log('跳過 LIFF 初始化：HTTPS 開發環境');
      return false;
    }
  }

  // 嘗試從 localStorage 恢復狀態
  if (!liffInitialized) {
    restoreLiffState();
  }

  // 如果已經初始化過，直接返回成功
  if (liffInitialized) {
    return true;
  }

  // 如果正在初始化中，等待現有的初始化完成
  if (liffInitPromise) {
    return await liffInitPromise;
  }

  // 檢查 LIFF 是否已經準備好（通過檢查是否在客戶端環境）
  try {
    if (
      (await isLiffModuleAvailable()) &&
      liff &&
      typeof liff === 'object' &&
      'isInClient' in liff &&
      (liff as any).isInClient()
    ) {
      liffInitialized = true;
      saveLiffState(true);
      return true;
    }
  } catch {
    // 如果檢查失敗，繼續初始化流程
  }

  // 開始新的初始化
  liffInitPromise = (async () => {
    try {
      // 添加超時處理
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('LIFF 初始化超時')), 3000);
      });

      const initPromise =
        liff && typeof liff === 'object' && 'init' in liff
          ? (liff as any).init(liffConfig)
          : Promise.reject(new Error('LIFF not available'));

      await Promise.race([initPromise, timeoutPromise]);

      liffInitialized = true;
      saveLiffState(true);
      return true;
    } catch (_error) {
      liffInitialized = false;
      saveLiffState(false);
      // 初始化失敗時返回 false，但不拋出錯誤
      return false;
    } finally {
      liffInitPromise = null;
    }
  })();

  return await liffInitPromise;
};

// 檢查 LIFF 是否已經初始化
export const isLiffInitialized = (): boolean => {
  return liffInitialized;
};

// 檢查是否在 LIFF 環境中
export const isInLiff = async () => {
  return (
    (await isLiffModuleAvailable()) &&
    liff &&
    typeof liff === 'object' &&
    'isInClient' in liff &&
    (liff as any).isInClient()
  );
};

// 檢查 LIFF 是否可用（已初始化且沒有錯誤）
export const isLiffAvailable = async (): Promise<boolean> => {
  return Boolean(
    liffInitialized &&
      (await isLiffModuleAvailable()) &&
      liff &&
      typeof liff === 'object' &&
      'isInClient' in liff &&
      !(liff as any).isInClient()
  );
};

// 分享到 LINE 好友
export const shareToLine = async (text: string, url?: string) => {
  try {
    if (
      liffInitialized &&
      (await isLiffModuleAvailable()) &&
      liff &&
      typeof liff === 'object' &&
      'isInClient' in liff &&
      (liff as any).isInClient()
    ) {
      // 在 LIFF 環境中，使用 liff.shareTargetPicker
      const messages: unknown[] = [
        {
          type: 'text',
          text,
        },
      ];

      if (url) {
        messages.push({
          type: 'text',
          text: url,
        });
      }

      (liff as any).shareTargetPicker(messages);
    } else {
      // 在非 LIFF 環境中，使用 LINE 分享 URL
      const shareUrl = `${
        LINE_CONSTANTS.SHARE_URLS.TEXT_MESSAGE
      }?${encodeURIComponent(text + (url ? `\n${url}` : ''))}`;
      window.open(shareUrl, '_blank');
    }
  } catch (_error) {
    // 降級到 LINE 分享 URL
    const shareUrl = `${
      LINE_CONSTANTS.SHARE_URLS.TEXT_MESSAGE
    }?${encodeURIComponent(text + (url ? `\n${url}` : ''))}`;
    window.open(shareUrl, '_blank');
  }
};

// 分享內容到廠商 LINE Official
export const shareQRCodeToVendor = async (
  url: string,
  type: 'order' | 'ticket' | 'registration' = 'order',
  metadata?: {
    orderId?: string;
    ticketId?: string;
    orderItemId?: string;
    ticketType?: string;
  }
) => {
  let text = '';

  switch (type) {
    case 'order':
      text = `訂單 ${metadata?.orderId} 的 QR Code 已生成，請掃描完成付款`;
      break;
    case 'ticket':
      text = `票券 ${metadata?.ticketType} 已出票，請查看票券詳情`;
      break;
    case 'registration':
      text = `報名表連結已生成，請點擊填寫 ${metadata?.ticketType} 的報名資訊`;
      break;
    default:
      text = '內容分享';
  }

  try {
    if (
      liffInitialized &&
      (await isLiffModuleAvailable()) &&
      liff &&
      typeof liff === 'object' &&
      'isInClient' in liff &&
      (liff as any).isInClient()
    ) {
      // 在 LIFF 環境中，使用 liff.shareTargetPicker
      (liff as any).shareTargetPicker([
        {
          type: 'text',
          text,
        },
        {
          type: 'text',
          text: url,
        },
      ]);
    } else {
      // 在非 LIFF 環境中，使用 LINE 分享 URL
      const shareUrl = `${
        LINE_CONSTANTS.SHARE_URLS.TEXT_MESSAGE
      }?${encodeURIComponent(`${text}\n${url}`)}`;
      window.open(shareUrl, '_blank');
    }
  } catch (_error) {
    // 降級到 LINE 分享 URL
    const shareUrl = `${
      LINE_CONSTANTS.SHARE_URLS.TEXT_MESSAGE
    }?${encodeURIComponent(`${text}\n${url}`)}`;
    window.open(shareUrl, '_blank');
  }
};

// 獲取用戶資料
export const getProfile = async () => {
  if (
    !(await isLiffModuleAvailable()) ||
    !liff ||
    typeof liff !== 'object' ||
    !('isLoggedIn' in liff) ||
    !(liff as any).isLoggedIn()
  ) {
    return null;
  }

  try {
    const profile = await (liff as any).getProfile();
    return profile;
  } catch (_error) {
    return null;
  }
};

// 獲取 ID Token (包含 LINE ID)
export const getIdToken = async () => {
  if (
    !(await isLiffModuleAvailable()) ||
    !liff ||
    typeof liff !== 'object' ||
    !('isLoggedIn' in liff) ||
    !(liff as any).isLoggedIn()
  ) {
    return null;
  }

  try {
    const idToken = await (liff as any).getIDToken();
    return idToken;
  } catch (_error) {
    return null;
  }
};

// 獲取 Access Token
export const getAccessToken = async () => {
  if (
    !(await isLiffModuleAvailable()) ||
    !liff ||
    typeof liff !== 'object' ||
    !('isLoggedIn' in liff) ||
    !(liff as any).isLoggedIn()
  ) {
    return null;
  }

  try {
    const accessToken = await (liff as any).getAccessToken();
    return accessToken;
  } catch (_error) {
    return null;
  }
};

// 解析 ID Token
export const decodeIdToken = (idToken: string) => {
  try {
    const [, payload] = idToken.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (_error) {
    return null;
  }
};

// LIFF 登入
export const login = async () => {
  if (!(await isLiffModuleAvailable())) {
    return;
  }

  if (
    liff &&
    typeof liff === 'object' &&
    'isLoggedIn' in liff &&
    (liff as any).isLoggedIn()
  ) {
    return;
  }

  if (liff && typeof liff === 'object' && 'login' in liff) {
    (liff as any).login();
  }
};

// LIFF 登出
export const logout = async () => {
  if (
    !(await isLiffModuleAvailable()) ||
    !liff ||
    typeof liff !== 'object' ||
    !('isLoggedIn' in liff) ||
    !(liff as any).isLoggedIn()
  ) {
    return;
  }

  if (liff && typeof liff === 'object' && 'logout' in liff) {
    (liff as any).logout();
  }
};

// 獲取 LIFF 環境資訊
export const getLiffContext = async () => {
  if (!(await isLiffModuleAvailable())) {
    return {
      isInClient: false,
      isLoggedIn: false,
      os: null,
      language: null,
      version: null,
      lineVersion: null,
    };
  }

  if (!liff || typeof liff !== 'object') {
    return {
      isInClient: false,
      isLoggedIn: false,
      os: null,
      language: null,
      version: null,
      lineVersion: null,
    };
  }

  return {
    isInClient: (liff as any).isInClient ? (liff as any).isInClient() : false,
    isLoggedIn: (liff as any).isLoggedIn ? (liff as any).isLoggedIn() : false,
    os: (liff as any).getOS ? (liff as any).getOS() : null,
    language: (liff as any).getLanguage ? (liff as any).getLanguage() : null,
    version: (liff as any).getVersion ? (liff as any).getVersion() : null,
    lineVersion: (liff as any).getLineVersion
      ? (liff as any).getLineVersion()
      : null,
  };
};

// 獲取完整用戶資訊 - 優化版本
export const getFullUserInfo = async () => {
  if (
    !(await isLiffModuleAvailable()) ||
    !liff ||
    typeof liff !== 'object' ||
    !('isLoggedIn' in liff) ||
    !(liff as any).isLoggedIn()
  ) {
    return null;
  }

  try {
    // 並行獲取所有資訊
    const [profile, idToken, accessToken] = await Promise.all([
      (liff as any).getProfile(),
      (liff as any).getIDToken(),
      (liff as any).getAccessToken(),
    ]);

    const _context = await getLiffContext();
    const decodedIdToken = idToken ? decodeIdToken(idToken) : null;
    const lineId = decodedIdToken?.sub ?? null;

    return {
      profile,
      idToken,
      accessToken,
      decodedIdToken,
      lineId,
    };
  } catch (_error) {
    return null;
  }
};
