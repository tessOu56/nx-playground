import { UnauthorizedException } from '@nestjs/common';

import {
  assertEcpayWebhookMac,
  computeEcpayCheckMacValue,
  ecpayDotNetUrlEncode,
  verifyEcpayCheckMacValue,
} from './ecpay-check-mac';

const HASH_KEY = '5294y06JbISpM5x9';
const HASH_IV = 'v77hoKGq4kWxNNIS';

const sampleFields = {
  MerchantID: '2000132',
  MerchantTradeNo: 'Ptesttrade0001',
  RtnCode: '1',
  TradeAmt: '100',
};

describe('ECPay CheckMacValue', () => {
  it('round-trips a signed payload and rejects tampering', () => {
    const CheckMacValue = computeEcpayCheckMacValue(
      sampleFields,
      HASH_KEY,
      HASH_IV
    );
    expect(CheckMacValue).toMatch(/^[A-F0-9]{32}$/);
    expect(
      verifyEcpayCheckMacValue(
        { ...sampleFields, CheckMacValue },
        HASH_KEY,
        HASH_IV
      )
    ).toBe(true);
    expect(
      verifyEcpayCheckMacValue(
        { ...sampleFields, RtnCode: '0', CheckMacValue },
        HASH_KEY,
        HASH_IV
      )
    ).toBe(false);
    expect(
      verifyEcpayCheckMacValue(
        { ...sampleFields, CheckMacValue: '0'.repeat(32) },
        HASH_KEY,
        HASH_IV
      )
    ).toBe(false);
    expect(verifyEcpayCheckMacValue(sampleFields, HASH_KEY, HASH_IV)).toBe(
      false
    );
  });

  it('encodes spaces the way ECPay’s .NET helper does', () => {
    expect(ecpayDotNetUrlEncode('HashKey=a b')).toBe('hashkey%3da+b');
  });

  it('rejects webhooks when hash keys are missing or MAC is wrong', () => {
    const originalKey = process.env.ECPAY_HASH_KEY;
    const originalIv = process.env.ECPAY_HASH_IV;
    delete process.env.ECPAY_HASH_KEY;
    delete process.env.ECPAY_HASH_IV;
    try {
      expect(() =>
        assertEcpayWebhookMac({
          ...sampleFields,
          CheckMacValue: 'A'.repeat(32),
        })
      ).toThrow(UnauthorizedException);

      process.env.ECPAY_HASH_KEY = HASH_KEY;
      process.env.ECPAY_HASH_IV = HASH_IV;
      expect(() =>
        assertEcpayWebhookMac({
          ...sampleFields,
          CheckMacValue: 'A'.repeat(32),
        })
      ).toThrow(UnauthorizedException);

      const CheckMacValue = computeEcpayCheckMacValue(
        sampleFields,
        HASH_KEY,
        HASH_IV
      );
      expect(() =>
        assertEcpayWebhookMac({ ...sampleFields, CheckMacValue })
      ).not.toThrow();
    } finally {
      if (originalKey === undefined) delete process.env.ECPAY_HASH_KEY;
      else process.env.ECPAY_HASH_KEY = originalKey;
      if (originalIv === undefined) delete process.env.ECPAY_HASH_IV;
      else process.env.ECPAY_HASH_IV = originalIv;
    }
  });
});
