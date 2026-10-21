module.exports = {
  displayName: 'api-server',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@nx-playground/permissions/server$':
      '<rootDir>/../../libs/permissions/src/server.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  transformIgnorePatterns: ['/node_modules/(?!jose/)'],
  coverageDirectory: '../../coverage/apps/api-server',
};
