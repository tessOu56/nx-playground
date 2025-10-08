module.exports = {
  // 測試環境 - 根據測試類型動態設置
  testEnvironment: 'jsdom',

  // TypeScript 支持
  preset: 'ts-jest',

  // 測試文件匹配模式
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],

  // 模組解析
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/events/src/$1',
    // Next.js 相關模組映射
    '^@/components/(.*)$': '<rootDir>/apps/events/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/apps/events/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/apps/events/src/types/$1',
    // 靜態資源映射
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },

  // 轉換配置
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // 收集覆蓋率
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // 覆蓋率閾值 (逐步提高要求)
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Mock 資料測試要求更高覆蓋率
    'apps/events/src/lib/mock/**/*.ts': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // 忽略的檔案
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.next/',
    '/out/',
    '/.nx/',
    'jest.config.js',
    'jest.setup.js',
    'tailwind.config.js',
    'postcss.config.js',
  ],

  // 測試超時
  testTimeout: 10000,

  // 設置文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 清除 mock
  clearMocks: true,

  // 重置 mock
  resetMocks: true,

  // 恢復 mock
  restoreMocks: true,

  // 項目配置 (適用於 monorepo)
  projects: [
    {
      displayName: 'mock-data',
      testMatch: ['<rootDir>/apps/events/src/lib/mock/**/*.(test|spec).(ts)'],
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/events/src/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
    },
    {
      displayName: 'react-components',
      testMatch: ['<rootDir>/apps/events/src/**/*.(test|spec).(tsx)'],
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/events/src/$1',
        '^@/components/(.*)$': '<rootDir>/apps/events/src/components/$1',
        '^@/lib/(.*)$': '<rootDir>/apps/events/src/lib/$1',
        '^@/types/(.*)$': '<rootDir>/apps/events/src/types/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/__mocks__/fileMock.js',
      },
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
    },
    {
      displayName: 'i18n',
      testMatch: ['<rootDir>/apps/events/src/lib/i18n/**/*.(test|spec).(ts)'],
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/events/src/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
    },
  ],
};
