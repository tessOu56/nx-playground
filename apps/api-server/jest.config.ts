module.exports = {
  displayName: 'api-server',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@nx-playground/permissions/server$':
      '<rootDir>/../../libs/permissions/src/server.ts',
    '^@nx-playground/exhibition-embeddings$':
      '<rootDir>/../../libs/exhibition-embeddings/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  transformIgnorePatterns: ['node_modules/(?!.*jose)'],
  coverageDirectory: '../../coverage/apps/api-server',
};
