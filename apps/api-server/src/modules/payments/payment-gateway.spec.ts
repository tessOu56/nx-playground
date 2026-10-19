import { isPaymentCallbackEnabled } from './payment-gateway';

describe('isPaymentCallbackEnabled', () => {
  it('is open outside production', () => {
    expect(isPaymentCallbackEnabled({ NODE_ENV: 'development' })).toBe(true);
    expect(isPaymentCallbackEnabled({ NODE_ENV: 'test' })).toBe(true);
    expect(isPaymentCallbackEnabled({})).toBe(true);
  });

  it('is closed in production unless ALLOW_NONPROD_PAYMENTS=true', () => {
    expect(isPaymentCallbackEnabled({ NODE_ENV: 'production' })).toBe(false);
    expect(
      isPaymentCallbackEnabled({
        NODE_ENV: 'production',
        ALLOW_NONPROD_PAYMENTS: '1',
      })
    ).toBe(false);
    expect(
      isPaymentCallbackEnabled({
        NODE_ENV: 'production',
        ALLOW_NONPROD_PAYMENTS: 'true',
      })
    ).toBe(true);
  });
});
