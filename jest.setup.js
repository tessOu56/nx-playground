// Jest 全局設置文件

// 設置測試環境變量
// 導入 React Testing Library 的擴展
import '@testing-library/jest-dom';

process.env.NODE_ENV = 'test';

// 模擬 console 方法以減少測試輸出噪音
global.console = {
  ...console,
  // 在測試中靜默 console.log
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 設置全局測試工具函數
global.testUtils = {
  // 創建測試用的 mock 數據
  createMockUser: () => ({
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    lineId: `U${'0'.repeat(32)}`,
  }),

  // 創建測試用的 mock 事件
  createMockEvent: () => ({
    id: 'test-event-1',
    title: 'Test Event',
    description: 'Test Description',
    date: '2024-12-31',
    location: 'Test Location',
  }),
};

// 設置測試超時
jest.setTimeout(10000);
