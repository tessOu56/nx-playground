import type { Metadata } from 'next';

export interface PageInfo {
  number: string;
  title: string;
  description: string;
  path: string;
  isPublic?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: readonly string[];
    ogImage?: string;
  };
}

// Next.js 頁面配置類型定義
export type DynamicConfig = 'auto' | 'force-dynamic' | 'error' | 'force-static';

export type RevalidateConfig = number | false;

export type FetchCacheConfig =
  | 'auto'
  | 'default-cache'
  | 'only-cache'
  | 'force-cache'
  | 'default-no-store'
  | 'only-no-store'
  | 'force-no-store';

export type RuntimeConfig = 'nodejs' | 'edge';

export interface PageConfig {
  /** 動態渲染配置 */
  dynamic?: DynamicConfig;

  /** 重新驗證時間（秒） */
  revalidate?: RevalidateConfig;

  /** 快取配置 */
  fetchCache?: FetchCacheConfig;

  /** 運行時環境 */
  runtime?: RuntimeConfig;

  /** 是否啟用 SSR */
  ssr?: boolean;

  /** 是否啟用 ISR */
  isr?: boolean;

  /** 預設語言 */
  preferredRegion?: string | string[];

  /** 靜態 metadata */
  metadata?: Metadata;

  /** 動態 metadata 生成函數 */
  generateMetadata?: (params: any) => Promise<Metadata>;
}
