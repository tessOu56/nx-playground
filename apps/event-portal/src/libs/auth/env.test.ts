import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { betterAuthSecret } from './env';

describe('betterAuthSecret', () => {
  it('fails closed in production when BETTER_AUTH_SECRET is missing', () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousSecret = process.env.BETTER_AUTH_SECRET;
    delete process.env.BETTER_AUTH_SECRET;
    process.env.NODE_ENV = 'production';
    try {
      assert.throws(() => betterAuthSecret(), /BETTER_AUTH_SECRET is required/);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      if (previousSecret === undefined) {
        delete process.env.BETTER_AUTH_SECRET;
      } else {
        process.env.BETTER_AUTH_SECRET = previousSecret;
      }
    }
  });
});
