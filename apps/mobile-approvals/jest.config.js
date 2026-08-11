/** Smoke-test config: pure TS logic only, no react-native renderer needed for M0. */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};
