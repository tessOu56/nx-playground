import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getLineRedirectUri } from './constants';

describe('getLineRedirectUri', () => {
  it('uses the page origin on a hosted site when env is localhost', () => {
    assert.equal(
      getLineRedirectUri(
        {
          protocol: 'https:',
          hostname: 'nx-event-portal.vercel.app',
          origin: 'https://nx-event-portal.vercel.app',
        },
        'http://localhost:3000'
      ),
      'https://nx-event-portal.vercel.app'
    );
  });

  it('keeps localhost for local dev pages', () => {
    assert.equal(
      getLineRedirectUri(
        {
          protocol: 'http:',
          hostname: 'localhost',
          origin: 'http://localhost:3000',
        },
        'http://localhost:3000'
      ),
      'http://localhost:3000'
    );
  });

  it('keeps an explicit hosted callback when env is already set', () => {
    assert.equal(
      getLineRedirectUri(
        {
          protocol: 'https:',
          hostname: 'nx-event-portal.vercel.app',
          origin: 'https://nx-event-portal.vercel.app',
        },
        'https://nx-event-portal.vercel.app'
      ),
      'https://nx-event-portal.vercel.app'
    );
  });
});
