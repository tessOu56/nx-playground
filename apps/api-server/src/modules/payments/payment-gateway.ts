export const ECPAY_SANDBOX_CHECKOUT =
  'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
export const ECPAY_LIVE_HOST = 'payment.ecpay.com.tw';

export type PaymentProvider = 'mock' | 'ecpay-sandbox';

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

export function mockCheckoutUrl(
  publicApiBase: string,
  intentId: string
): string {
  return `${publicApiBase.replace(/\/$/, '')}/payments/mock-complete/${intentId}`;
}

export function checkoutUrlForProvider(
  provider: PaymentProvider,
  publicApiBase: string,
  intentId: string
): string {
  if (provider === 'ecpay-sandbox') return ECPAY_SANDBOX_CHECKOUT;
  return mockCheckoutUrl(publicApiBase, intentId);
}

export function assertSandboxCheckoutUrl(url: string): void {
  if (url.includes(ECPAY_LIVE_HOST) && !url.includes('payment-stage')) {
    throw new Error('Live ECPay is T-244 / STOP-014');
  }
}

export function webhookStatusFromRtnCode(
  rtnCode: string | number | undefined
): 'paid' | 'failed' {
  return String(rtnCode) === '1' ? 'paid' : 'failed';
}

export function portalPublicUrl(): string {
  return (process.env.PORTAL_PUBLIC_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
}

export function portalOrderReturnUrl(
  orderId: string,
  outcome: 'paid' | 'failed'
): string {
  const pay = outcome === 'paid' ? 'ok' : 'failed';
  return `${portalPublicUrl()}/zh-TW/orders/${orderId}?pay=${pay}`;
}

export function publicApiBaseFromRequest(host?: string): string {
  if (process.env.PUBLIC_API_BASE_URL) {
    return process.env.PUBLIC_API_BASE_URL.replace(/\/$/, '');
  }
  if (host) return `http://${host}/api`;
  return 'http://localhost:3001/api';
}

export function mockCompleteHtml(input: {
  orderId: string;
  amount: number;
}): string {
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <title>模擬付款</title>
  </head>
  <body>
    <h1>模擬金流（非綠界真實刷卡）</h1>
    <p>訂單 ${input.orderId} · NT$ ${input.amount}</p>
    <p><a href="?outcome=paid">模擬付款成功</a></p>
    <p><a href="?outcome=failed">模擬付款失敗</a></p>
  </body>
</html>`;
}
