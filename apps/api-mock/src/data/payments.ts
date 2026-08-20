export const ECPAY_SANDBOX_CHECKOUT =
  'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

export type PaymentProvider = 'mock' | 'ecpay-sandbox';
export type PaymentIntentStatus = 'created' | 'paid' | 'failed';

export interface PaymentIntentRecord {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentIntentStatus;
  merchantTradeNo: string;
  amount: number;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
}

export function paymentProviderFromEnv(): PaymentProvider {
  const merchantId = process.env.ECPAY_MERCHANT_ID?.trim() ?? '';
  const hashKey = process.env.ECPAY_HASH_KEY?.trim() ?? '';
  const hashIV = process.env.ECPAY_HASH_IV?.trim() ?? '';
  if (merchantId && hashKey && hashIV) return 'ecpay-sandbox';
  return 'mock';
}

export function amountFromOrderData(data: Record<string, unknown>): number {
  return Math.max(0, Math.floor(Number(data.totalAmount ?? 0) || 0));
}

export function newMerchantTradeNo(): string {
  return `P${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`.slice(0, 20);
}

export function checkoutUrlForProvider(
  provider: PaymentProvider,
  publicApiBase: string,
  intentId: string
): string {
  if (provider === 'ecpay-sandbox') return ECPAY_SANDBOX_CHECKOUT;
  return `${publicApiBase.replace(/\/$/, '')}/payments/mock-complete/${intentId}`;
}

export function webhookStatusFromRtnCode(
  rtnCode: string | number | undefined
): 'paid' | 'failed' {
  return String(rtnCode) === '1' ? 'paid' : 'failed';
}

export function portalOrderReturnUrl(
  orderId: string,
  outcome: 'paid' | 'failed'
): string {
  const base = (process.env.PORTAL_PUBLIC_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
  const pay = outcome === 'paid' ? 'ok' : 'failed';
  return `${base}/zh-TW/orders/${orderId}?pay=${pay}`;
}

export function mockCompleteHtml(intent: PaymentIntentRecord): string {
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <title>模擬付款</title>
  </head>
  <body>
    <h1>模擬金流（非綠界真實刷卡）</h1>
    <p>訂單 ${intent.orderId} · NT$ ${intent.amount}</p>
    <p><a href="?outcome=paid">模擬付款成功</a></p>
    <p><a href="?outcome=failed">模擬付款失敗</a></p>
  </body>
</html>`;
}
