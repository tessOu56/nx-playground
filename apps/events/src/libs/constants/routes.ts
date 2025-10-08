export const ROUTES = {
  // 主要頁面
  HOME: '/',
  VENDOR: '/vendors',
  INFO: '/info',
  STAFF: '/staff',
  CHECKOUT: '/checkout',
  CHECKIN: '/check-in',
  ORDERS: '/orders',
  REGISTRATIONS: '/registrations',
  DEBUG: '/debug',

  // 付款相關
  PAYMENT: {
    CASH: (orderId: string) => `/payment/${orderId}`,
    ATM: (orderId: string) => `/payment/atm/${orderId}`,
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
