/**
 * 專案資料類型定義
 * 用於 README、PRD 和 CHANGELOG 的資料結構
 */

import type { SupportedLocale } from '../lib/i18n/LocaleRouter';

/**
 * README 資料結構（技術文檔）
 */
export interface ProjectReadme {
  id: string;
  name: string;
  version: string;
  description: string;
  techStack: string[];
  features: string[];
  readmeContent: string; // Markdown HTML 內容
  demoUrl?: string;
  repoUrl?: string;
  lastUpdated?: string;
  author?: string;
  license?: string;
}

/**
 * PRD 資料結構（產品規格）
 */
export interface ProjectSpec {
  id: string;
  version: string;
  category: string;
  status: 'production' | 'development' | 'coming-soon';
  published: boolean;
  shortDesc: string;
  purpose: string;
  highlights: string[];
  useCases?: string[];
  targetAudience?: string;
  specLastUpdated: string;
  lastSync?: string;
  reviewer?: string;
  reviewedAt?: string;
  updateFrequency?: 'per-feature' | 'weekly' | 'monthly' | 'on-demand';
  nextReview?: string;
  draftStatus?: boolean;
  approvalStatus?: 'draft' | 'pending' | 'approved';
  changesSince?: string;
  relatedDocs?: string[];
  stats?: {
    components?: number;
    hooks?: number;
    utilities?: number;
  };
  specContent?: string; // PRD Markdown HTML 內容（可選）
}

/**
 * CHANGELOG Release 資料結構
 */
export interface Release {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    added?: string[];
    changed?: string[];
    fixed?: string[];
    removed?: string[];
    deprecated?: string[];
    security?: string[];
    breaking?: string[];
  };
  isUnreleased?: boolean;
}

/**
 * CHANGELOG 資料結構
 */
export interface ProjectChangelog {
  appId: string;
  releases: Release[];
  latest: Release | null;
  major: Release[]; // 只包含重大版本
}

/**
 * 完整專案資料（README + PRD + CHANGELOG）
 */
export interface ProjectData extends ProjectReadme, Omit<ProjectSpec, 'id' | 'version'> {
  changelog?: ProjectChangelog;
  locale: SupportedLocale;
}

/**
 * App 專案資料
 */
export type AppData = ProjectData & {
  category: 'react' | 'angular' | 'vue' | 'nextjs';
};

/**
 * Lib 專案資料
 */
export type LibData = ProjectData & {
  category: 'ui' | 'data' | 'utils';
  stats?: {
    components?: number;
    hooks?: number;
    utilities?: number;
  };
};

