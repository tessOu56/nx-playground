// API 環境配置
export const apiConfig = {
  // 是否使用 Mock API
  useMock:
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development' &&
    (process.env.REACT_APP_USE_MOCK === 'true' ||
      (typeof window !== 'undefined' && (window as any).__USE_MOCK__)),

  // API 基礎 URL
  baseUrl:
    (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ??
    'http://localhost:3001/api',

  // Mock 延遲時間 (毫秒)
  mockDelay: 500,

  // 開發環境配置
  development: {
    useMock: true,
    mockDelay: 300,
  },

  // 生產環境配置
  production: {
    useMock: false,
    mockDelay: 0,
  },
};

// 動態切換 Mock 模式
export const toggleMockMode = () => {
  if (typeof window !== 'undefined') {
    (window as any).__USE_MOCK__ = !(window as any).__USE_MOCK__;
    // 重新載入頁面以應用變更
    window.location.reload();
  }
};

// 檢查當前是否使用 Mock
export const isUsingMock = () => {
  return apiConfig.useMock;
};
