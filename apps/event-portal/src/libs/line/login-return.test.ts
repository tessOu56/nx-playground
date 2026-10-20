import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isLineLoginCancelledError,
  safeLineLoginReturnPath,
  stripLineOauthCallbackParams,
} from './login-return';

describe('safeLineLoginReturnPath', () => {
  it('keeps same-origin locale paths and rejects open redirects', () => {
    assert.equal(
      safeLineLoginReturnPath('/zh-TW/events/event_sample_tfam', 'zh-TW'),
      '/zh-TW/events/event_sample_tfam'
    );
    assert.equal(safeLineLoginReturnPath('/en', 'en'), '/en');
    assert.equal(safeLineLoginReturnPath('/ja/events', 'ja'), '/ja/events');
    assert.equal(
      safeLineLoginReturnPath('https://evil.example/phish', 'zh-TW'),
      '/zh-TW/events'
    );
    assert.equal(
      safeLineLoginReturnPath('//evil.example/phish', 'en'),
      '/en/events'
    );
    assert.equal(
      safeLineLoginReturnPath('/zh-TW/events/../admin', 'zh-TW'),
      '/zh-TW/events'
    );
    assert.equal(
      safeLineLoginReturnPath('/zh-TW/events?code=stolen', 'zh-TW'),
      '/zh-TW/events'
    );
  });
});

describe('stripLineOauthCallbackParams', () => {
  it('drops code/state and keeps catalog filters', () => {
    assert.equal(
      stripLineOauthCallbackParams('code=abc&state=xyz&city=TAIPEI'),
      'city=TAIPEI'
    );
    assert.equal(stripLineOauthCallbackParams('q=台北'), 'q=%E5%8F%B0%E5%8C%97');
  });
});

describe('isLineLoginCancelledError', () => {
  it('treats access_denied as cancel, not a hard failure', () => {
    assert.equal(isLineLoginCancelledError('access_denied'), true);
    assert.equal(isLineLoginCancelledError('server_error'), false);
    assert.equal(isLineLoginCancelledError(null), false);
  });
});
