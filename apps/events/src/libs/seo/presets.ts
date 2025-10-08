/**
 * Next.js 頁面配置預設值
 */

import {
  generateEventMetadata,
  generateOrderMetadata,
  generateVendorMetadata,
} from './metadataGenerators';

import type { PageConfig } from '@/types';

/**
 * 頁面類型預設配置
 */
export const PAGE_CONFIG_PRESETS = {
  /** 靜態頁面 - 適合內容不變的頁面 */
  static: {
    dynamic: 'force-static' as const,
    revalidate: false,
    fetchCache: 'force-cache' as const,
    ssr: true,
    isr: false,
  },

  /** 動態頁面 - 適合需要即時數據的頁面 */
  dynamic: {
    dynamic: 'auto' as const,
    revalidate: 0, // 不緩存，每次都重新驗證
    fetchCache: 'force-no-store' as const,
    ssr: true,
    isr: false,
  },

  /** 混合頁面 - 適合大部分頁面 */
  hybrid: {
    dynamic: 'auto' as const,
    revalidate: 60, // 1分鐘重新驗證
    fetchCache: 'auto' as const,
    ssr: true,
    isr: true,
  },

  /** 首頁配置 */
  home: {
    dynamic: 'force-static' as const,
    revalidate: false,
    fetchCache: 'force-cache' as const,
    ssr: true,
    isr: false,
  },

  /** 表單頁面 - 適合互動性強的頁面 */
  form: {
    dynamic: 'auto' as const,
    revalidate: 0, // 不緩存，每次都重新驗證
    fetchCache: 'force-no-store' as const,
    ssr: true,
    isr: false,
  },

  /** API 頁面 - 適合 API 路由 */
  api: {
    dynamic: 'force-dynamic' as const,
    revalidate: false,
    fetchCache: 'force-no-store' as const,
    runtime: 'nodejs' as const,
    ssr: false,
    isr: false,
  },

  /** Edge 頁面 - 適合需要低延遲的頁面 */
  edge: {
    dynamic: 'auto' as const,
    revalidate: 300, // 5分鐘重新驗證
    fetchCache: 'default-cache' as const,
    runtime: 'edge' as const,
    ssr: true,
    isr: true,
  },

  /** 活動詳情頁面 - 帶動態 metadata */
  eventDetail: {
    dynamic: 'force-static' as const,
    revalidate: false,
    fetchCache: 'force-cache' as const,
    ssr: true,
    isr: false,
    generateMetadata: generateEventMetadata,
  },

  /** 訂單詳情頁面 - 帶動態 metadata */
  orderDetail: {
    dynamic: 'auto' as const,
    revalidate: 60, // 1分鐘重新驗證
    fetchCache: 'auto' as const,
    ssr: true,
    isr: true,
    generateMetadata: generateOrderMetadata,
  },

  /** 主辦方詳情頁面 - 帶動態 metadata */
  vendorDetail: {
    dynamic: 'force-static' as const,
    revalidate: false,
    fetchCache: 'force-cache' as const,
    ssr: true,
    isr: false,
    generateMetadata: generateVendorMetadata,
  },

  /** 結帳頁面 - 帶動態 metadata */
  checkout: {
    dynamic: 'auto' as const,
    revalidate: 0, // 不緩存，每次都重新驗證
    fetchCache: 'force-no-store' as const,
    ssr: true,
    isr: false,
  },

  /** 報名表單頁面 - 帶動態 metadata */
  registration: {
    dynamic: 'auto' as const,
    revalidate: 0, // 不緩存，每次都重新驗證
    fetchCache: 'force-no-store' as const,
    ssr: true,
    isr: false,
  },
} as const satisfies Record<string, PageConfig>;
