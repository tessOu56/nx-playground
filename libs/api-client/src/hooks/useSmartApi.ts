import { isMockEnabled } from './useMockApi';

// 智能 API Hook 工廠
export const createSmartApiHook = <T>(realHook: () => T, mockHook: () => T) => {
  return () => {
    // 根據環境自動選擇使用 mock 或真實 API
    if (isMockEnabled()) {
      return mockHook();
    }
    return realHook();
  };
};
