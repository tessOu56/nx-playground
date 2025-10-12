import { generateLineSettings } from '../generate';

import type { LineSettings } from '@/types';

// 使用生成器創建特定的 LINE 設定，保留原有的業務邏輯資料
const specificLineSettings: Record<string, LineSettings> = {};

// 使用動態屬性避免 ESLint 警告
specificLineSettings['@nx_playground'] = generateLineSettings('@nx_playground', {
  displayName: 'NX Playground',
  description:
    'NX Playground 官方 LINE 帳號，提供最新活動資訊、報名服務和相關諮詢。',
  statusMessage: '歡迎來到 NX Playground！我們提供最棒的活動體驗。',
  pictureUrl: 'https://picsum.photos/seed/nx-playground/200/200',
});

specificLineSettings['@nx-playground_official'] = generateLineSettings(
  '@nx-playground_official',
  {
    displayName: 'NX Playground 官方',
    description:
      'NX Playground 官方 LINE 帳號，提供最新馬拉松賽事資訊、報名服務和相關諮詢。',
    statusMessage: '歡迎來到 NX Playground！我們提供最棒的跑步活動體驗。',
    pictureUrl: 'https://picsum.photos/seed/nx-playground/200/200',
  }
);

specificLineSettings['@guting_community'] = generateLineSettings(
  '@guting_community',
  {
    displayName: '古亭社區基金會',
    description:
      '古亭社區基金會官方 LINE 帳號，提供最新社區活動資訊、報名服務和相關諮詢。',
    statusMessage: '歡迎來到古亭社區基金會！我們提供最棒的社區活動體驗。',
    pictureUrl: 'https://picsum.photos/seed/guting/200/200',
  }
);

// 為第四個 vendor 生成 LINE 設定
const generatedLineSettings = generateLineSettings('@vendor4');

// 合併特定的 LINE 設定和生成的 LINE 設定
export const mockLineSettings: Record<string, LineSettings> = {
  ...specificLineSettings,
};

// 添加第四個 vendor 的 LINE 設定
mockLineSettings['@vendor4'] = generatedLineSettings;
