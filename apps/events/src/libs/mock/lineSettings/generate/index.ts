import type { LineSettings } from '@/types';

// LINE 帳號描述模板
const descriptionTemplates = [
  '{} 官方 LINE 帳號，提供最新活動資訊、報名服務和相關諮詢。',
  '{} 官方 LINE 帳號，專注於提供優質的活動體驗和客戶服務。',
  '{} 官方 LINE 帳號，為您提供最棒的活動資訊和報名服務。',
  '{} 官方 LINE 帳號，致力於創造美好的活動回憶。',
];

// 狀態訊息模板
const statusMessages = [
  '歡迎來到 {}！我們提供最棒的活動體驗。',
  '歡迎來到 {}！讓我們一起創造美好回憶。',
  '歡迎來到 {}！我們致力於提供優質服務。',
  '歡迎來到 {}！感謝您的支持與信任。',
  '歡迎來到 {}！我們期待與您一起參與精彩活動。',
];

// 顯示名稱後綴
const nameSuffixes = [
  '官方',
  'Official',
  '團隊',
  'Team',
  '基金會',
  'Foundation',
  '協會',
  'Association',
];

/**
 * 生成隨機的 LineSettings
 */
export function generateLineSettings(
  officialAccountId: string,
  options: {
    displayName?: string;
    description?: string;
    statusMessage?: string;
    pictureUrl?: string;
  } = {}
): LineSettings {
  const { displayName, description, statusMessage, pictureUrl } = options;

  // 從 officialAccountId 提取基礎名稱
  const baseName = officialAccountId.replace('@', '').replace('_', ' ');

  // 生成顯示名稱
  const finalDisplayName =
    displayName ??
    (() => {
      const suffix =
        nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
      return `${
        baseName.charAt(0).toUpperCase() + baseName.slice(1)
      } ${suffix}`;
    })();

  // 生成描述
  const finalDescription =
    description ??
    descriptionTemplates[
      Math.floor(Math.random() * descriptionTemplates.length)
    ].replace('{}', finalDisplayName);

  // 生成狀態訊息
  const finalStatusMessage =
    statusMessage ??
    statusMessages[Math.floor(Math.random() * statusMessages.length)].replace(
      '{}',
      finalDisplayName
    );

  // 生成圖片 URL
  const finalPictureUrl =
    pictureUrl ?? `https://picsum.photos/seed/${baseName}/200/200`;

  return {
    officialAccountId,
    description: finalDescription,
    displayName: finalDisplayName,
    pictureUrl: finalPictureUrl,
    statusMessage: finalStatusMessage,
  };
}

/**
 * 批量生成多個 LineSettings
 */
export function generateMultipleLineSettings(
  accountIds: string[],
  options: {
    displayNames?: Record<string, string>;
    descriptions?: Record<string, string>;
    statusMessages?: Record<string, string>;
    pictureUrls?: Record<string, string>;
  } = {}
): Record<string, LineSettings> {
  const {
    displayNames = {},
    descriptions = {},
    statusMessages = {},
    pictureUrls = {},
  } = options;

  const result: Record<string, LineSettings> = {};

  accountIds.forEach(accountId => {
    result[accountId] = generateLineSettings(accountId, {
      displayName: displayNames[accountId],
      description: descriptions[accountId],
      statusMessage: statusMessages[accountId],
      pictureUrl: pictureUrls[accountId],
    });
  });

  return result;
}
