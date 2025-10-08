import { withLocale } from './localeRoutes';

import type { PageInfo } from '@/types';

// 多語系頁面配置
const localizedPages = {
  'zh-TW': {
    'vendor-detail': {
      number: 'P02',
      title: '主辦方詳情',
      description: '查看主辦方的詳細介紹和活動列表',
      seo: {
        title: '主辦方詳情 - NX Playground Events',
        description: '查看主辦方的詳細介紹和活動列表',
        keywords: ['主辦方', '活動列表', 'NX Playground', 'Events'],
      },
    },
    'event-detail': {
      number: 'P03',
      title: '活動詳情',
      description: '活動詳細資訊頁面',
      seo: {
        title: '活動詳情 - NX Playground Events',
        description: '查看活動詳細資訊，了解活動內容、時間、地點等相關資訊',
        keywords: ['活動詳情', '活動資訊', '活動報名', '活動內容'],
      },
    },
    checkout: {
      number: 'P04',
      title: '選擇票券',
      description: '選擇票券類型和付款方式',
      seo: {
        title: '活動報名結帳 - NX Playground Events',
        description: '選擇票券類型和付款方式完成活動報名',
        keywords: ['結帳', '報名', '付款', '票券選擇'],
      },
    },
    order: {
      number: 'P05',
      title: '訂單確認',
      description: '訂單詳細資訊和付款指引',
      seo: {
        title: '訂單確認 - NX Playground Events',
        description: '確認活動報名訂單資訊和付款指引',
        keywords: ['訂單確認', '報名確認', '付款指引'],
      },
    },
    registration: {
      number: 'P06',
      title: '票券報名表填寫',
      description: '填寫票券報名資訊（登入用戶專用）',
      seo: {
        title: '票券報名表填寫 - NX Playground Events',
        description: '填寫票券報名相關資訊',
        keywords: ['票券報名表', '活動報名', '表單填寫'],
      },
    },
    feedback: {
      number: 'P07',
      title: '意見回饋',
      description: '平台意見收集和客服支援',
      seo: {
        title: '意見回饋 - NX Playground Events',
        description: '提供平台意見回饋和客服支援',
        keywords: ['意見回饋', '客服支援', '平台建議'],
      },
    },
    'ticket-detail': {
      number: 'P08',
      title: '報到 QR Code',
      description: '活動報到 QR Code 頁面',
      seo: {
        title: '活動報到 - NX Playground Events',
        description: '生成活動報到 QR Code，方便現場驗票',
        keywords: ['活動報到', 'QR Code', '驗票'],
      },
    },
    home: {
      number: 'P01',
      title: 'NX Playground Events 活動平台',
      description: '平台介紹和用戶流程說明',
      seo: {
        title: 'NX Playground Events - 活動平台',
        description: '了解平台功能和用戶流程，開始您的活動體驗',
        keywords: ['活動平台', '用戶流程', '平台介紹', 'NX Playground', 'Events'],
      },
    },
    'user-orders': {
      number: 'P09',
      title: '我的訂單',
      description: '登入用戶查看自己的訂單列表',
      seo: {
        title: '我的訂單 - NX Playground Events',
        description: '查看您的所有活動訂單和報名狀態',
        keywords: ['我的訂單', '訂單列表', '訂單管理'],
      },
    },
  },
  en: {
    'vendor-detail': {
      number: 'P02',
      title: 'Vendor Details',
      description: 'View vendor details and event listings',
      seo: {
        title: 'Vendor Details - NX Playground Events',
        description: 'View vendor details and event listings',
        keywords: ['vendor', 'event listings', 'NX Playground', 'Events'],
      },
    },
    'event-detail': {
      number: 'P03',
      title: 'Event Details',
      description: 'Event detailed information page',
      seo: {
        title: 'Event Details - NX Playground Events',
        description:
          'View event details, learn about event content, time, location and related information',
        keywords: [
          'event details',
          'event information',
          'event registration',
          'event content',
        ],
      },
    },
    checkout: {
      number: 'P04',
      title: 'Select Tickets',
      description: 'Select ticket type and payment method',
      seo: {
        title: 'Event Registration Checkout - NX Playground Events',
        description:
          'Select ticket type and payment method to complete event registration',
        keywords: ['checkout', 'registration', 'payment', 'ticket selection'],
      },
    },
    order: {
      number: 'P05',
      title: 'Order Confirmation',
      description: 'Order details and payment instructions',
      seo: {
        title: 'Order Confirmation - NX Playground Events',
        description:
          'Confirm event registration order information and payment instructions',
        keywords: [
          'order confirmation',
          'registration confirmation',
          'payment instructions',
        ],
      },
    },
    registration: {
      number: 'P06',
      title: 'Ticket Registration Form',
      description:
        'Fill in ticket registration information (for logged-in users)',
      seo: {
        title: 'Ticket Registration Form - NX Playground Events',
        description: 'Fill in ticket registration related information',
        keywords: [
          'ticket registration form',
          'event registration',
          'form filling',
        ],
      },
    },
    feedback: {
      number: 'P07',
      title: 'Feedback',
      description: 'Platform feedback collection and customer support',
      seo: {
        title: 'Feedback - NX Playground Events',
        description: 'Provide platform feedback and customer support',
        keywords: ['feedback', 'customer support', 'platform suggestions'],
      },
    },
    'ticket-detail': {
      number: 'P08',
      title: 'Check-in QR Code',
      description: 'Event check-in QR Code page',
      seo: {
        title: 'Event Check-in - NX Playground Events',
        description:
          'Generate event check-in QR Code for convenient on-site ticket verification',
        keywords: ['event check-in', 'QR Code', 'ticket verification'],
      },
    },
    home: {
      number: 'P01',
      title: 'NX Playground Events Platform',
      description: 'Platform introduction and user flow guide',
      seo: {
        title: 'NX Playground Events - Event Platform',
        description:
          'Learn about platform features and user flow, start your event experience',
        keywords: [
          'event platform',
          'user flow',
          'platform introduction',
          'NX Playground',
          'Events',
        ],
      },
    },
    'user-orders': {
      number: 'P09',
      title: 'My Orders',
      description: 'Logged-in users can view their order list',
      seo: {
        title: 'My Orders - NX Playground Events',
        description: 'View all your event orders and registration status',
        keywords: ['my orders', 'order list', 'order management'],
      },
    },
  },
} as const;

// 動態生成帶有指定 locale 的頁面配置
export function getPageNumbersWithLocale(locale = 'zh-TW') {
  const currentLocale = locale as keyof typeof localizedPages;
  const localePages = localizedPages[currentLocale] || localizedPages['zh-TW'];

  // 基礎路徑配置（不包含語系前綴）- 基於實際 mock 數據
  const basePaths = {
    'vendor-detail': '/vendors/vendor-1', // 使用實際存在的 vendor-1
    'event-detail': '/events/event-1', // 使用實際存在的 event-1
    checkout: '/events/event-1/checkout',
    order: '/orders/order-001', // 使用實際存在的 order-001
    registration: '/orders/order-001/items/order-item-001-1/registration',
    feedback: '/feedback',
    'ticket-detail': '/orders/order-001/tickets/order-001-ticket-1/check-in',
    home: '/',
    'user-orders': '/orders',
  };

  // 訂單狀態頁面配置 - 基於實際 mock 數據
  const orderStatusPagesConfig = {
    // P05a - 現場付款待付款
    'order-cash-pending': {
      number: 'P05a',
      title: locale === 'en' ? 'Cash Payment Pending' : '現場付款待付款',
      description:
        locale === 'en'
          ? 'Cash payment order pending, please complete payment on-site'
          : '現場付款訂單待付款，請於現場完成付款',
      path: withLocale('/orders/order-002', locale), // order-002: 現場付款待付款
      isPublic: false,
    },
    // P05b - 現場付款完成出票中
    'order-cash-issuing': {
      number: 'P05b',
      title:
        locale === 'en' ? 'Cash Payment Issuing Tickets' : '現場付款完成出票中',
      description:
        locale === 'en'
          ? 'Cash payment completed, tickets are being issued'
          : '現場付款已完成，正在為您出票',
      path: withLocale('/orders/order-007', locale), // order-007: 現場付款已付款但出票中
      isPublic: false,
    },
    // P05c - 現場付款完成已出票
    'order-cash-issued': {
      number: 'P05c',
      title: locale === 'en' ? 'Cash Payment Completed' : '現場付款完成已出票',
      description:
        locale === 'en'
          ? 'Cash payment completed and tickets issued, ready for use'
          : '現場付款已完成且已出票，可立即使用',
      path: withLocale('/orders/order-001', locale), // order-001: 現場付款已付款且已出票
      isPublic: false,
    },
    // P05d - ATM 轉帳待付款
    'order-atm-pending': {
      number: 'P05d',
      title: locale === 'en' ? 'ATM Transfer Pending' : 'ATM 轉帳待付款',
      description:
        locale === 'en'
          ? 'ATM transfer order pending payment, includes transfer information and confirmation form'
          : 'ATM 轉帳訂單待付款，包含轉帳資訊和確認表單',
      path: withLocale('/orders/order-003', locale), // order-003: ATM轉帳待付款
      isPublic: false,
    },
    // P05e - ATM 轉帳核帳中
    'order-atm-verifying': {
      number: 'P05e',
      title: locale === 'en' ? 'ATM Transfer Verifying' : 'ATM 轉帳核帳中',
      description:
        locale === 'en'
          ? 'ATM transfer submitted, payment verification in progress'
          : 'ATM 轉帳已提交，付款驗證進行中',
      path: withLocale('/orders/order-004', locale), // order-004: ATM轉帳核帳中
      isPublic: false,
    },
    // P05f - ATM 轉帳完成出票中
    'order-atm-issuing': {
      number: 'P05f',
      title:
        locale === 'en' ? 'ATM Transfer Issuing Tickets' : 'ATM 轉帳完成出票中',
      description:
        locale === 'en'
          ? 'ATM transfer completed, tickets are being issued'
          : 'ATM 轉帳已完成，正在為您出票',
      path: withLocale('/orders/order-005', locale), // order-005: ATM轉帳已付款要出票
      isPublic: false,
    },
    // P05g - ATM 轉帳完成已出票
    'order-atm-issued': {
      number: 'P05g',
      title: locale === 'en' ? 'ATM Transfer Completed' : 'ATM 轉帳完成已出票',
      description:
        locale === 'en'
          ? 'ATM transfer completed and tickets issued, ready for use'
          : 'ATM 轉帳已完成且已出票，可立即使用',
      path: withLocale('/orders/order-006', locale), // order-006: ATM轉帳已付款且已出票
      isPublic: false,
    },
  };

  // 分離主要流程頁面和訂單狀態頁面
  const mainFlowPages: PageInfo[] = [];
  const orderStatusPages: PageInfo[] = [];

  // 處理多語系頁面配置
  for (const [key, pageConfig] of Object.entries(localePages)) {
    const pageInfo: PageInfo = {
      ...pageConfig,
      path: withLocale(basePaths[key as keyof typeof basePaths] || '/', locale),
      isPublic:
        key === 'home' ||
        key === 'vendor-detail' ||
        key === 'event-detail' ||
        key === 'checkout' ||
        key === 'feedback',
    };

    // 根據頁面編號分類
    const pageNum = parseInt(pageInfo.number.replace('P', ''));
    if (pageNum >= 2 && pageNum <= 9) {
      // P02-P08: 主要流程頁面
      mainFlowPages.push(pageInfo);
    } else if (pageNum === 1 || pageNum >= 10) {
      // P01 + P09+: 訂單狀態頁面
      orderStatusPages.push(pageInfo);
    }
  }

  // 處理訂單狀態頁面配置
  for (const pageInfo of Object.values(orderStatusPagesConfig)) {
    orderStatusPages.push(pageInfo);
  }

  // 排序
  mainFlowPages.sort((a, b) => {
    const numA = parseInt(a.number.replace('P', ''));
    const numB = parseInt(b.number.replace('P', ''));
    return numA - numB;
  });

  orderStatusPages.sort((a, b) => {
    const numA = parseInt(a.number.replace('P', ''));
    const numB = parseInt(b.number.replace('P', ''));
    return numA - numB;
  });

  return {
    mainFlowPages,
    orderStatusPages,
    // 向後兼容：合併所有頁面
    allPages: [...mainFlowPages, ...orderStatusPages].reduce((acc, page) => {
      acc[page.number] = page;
      return acc;
    }, {} as Record<string, PageInfo>),
  };
}

// 向後兼容：預設使用 zh-TW 語系的頁面配置
export const pageNumbers = getPageNumbersWithLocale('zh-TW').allPages;
export type PageKey = keyof typeof pageNumbers;

// 根據路徑獲取頁面資訊
export const getPageInfoByPath = (
  pathname: string,
  locale?: string
): PageInfo | null => {
  // 移除開頭的斜線
  const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;

  // 移除 locale 前綴（如果存在）
  let pathWithoutLocale = cleanPath;
  let detectedLocale = locale;

  if (cleanPath.startsWith('zh-TW/')) {
    pathWithoutLocale = cleanPath.slice(6);
    detectedLocale = 'zh-TW';
  } else if (cleanPath.startsWith('en/')) {
    pathWithoutLocale = cleanPath.slice(3);
    detectedLocale = 'en';
  }

  // 處理動態路由
  const normalizedPath = pathWithoutLocale
    .replace(/\/\[.*?\]/g, '/[id]') // 將動態參數替換為 [id]
    .replace(/\/$/, ''); // 移除結尾斜線

  // 使用檢測到的 locale 或預設值來獲取頁面配置
  const currentLocale = detectedLocale ?? 'zh-TW';
  const pageNumbersWithLocale = getPageNumbersWithLocale(currentLocale);

  for (const pageInfo of [
    ...pageNumbersWithLocale.mainFlowPages,
    ...pageNumbersWithLocale.orderStatusPages,
  ]) {
    // 從 pageInfo.path 中移除 locale 前綴進行比較
    const pagePathWithoutLocale = pageInfo.path
      .replace(/^\/(zh-TW|en)\//, '/')
      .replace(/^\//, '')
      .replace(/\/\[.*?\]/g, '/[id]')
      .replace(/\/$/, '');

    if (pagePathWithoutLocale === normalizedPath) {
      return pageInfo;
    }
  }

  return null;
};
