/**
 * 解析列表項目字符串
 * 使用 | 符號分隔多個列表項目
 * @param textData 包含列表項目的字符串
 * @returns 解析後的列表項目數組
 */
export function parseListItems(textData: string): string[] {
  if (!textData) return [];

  return textData
    .split('|')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * 偵測是否為編號列表
 * 檢查項目是否以數字開頭（如 "1. 項目" 或 "1) 項目"）
 * @param items 列表項目數組
 * @returns 是否為編號列表
 */
export function detectOrderedList(items: string[]): boolean {
  if (items.length === 0) return false;

  // 檢查前幾個項目是否以數字開頭
  const sampleSize = Math.min(3, items.length);
  const orderedCount = items.slice(0, sampleSize).filter(item => {
    // 匹配 "1. 項目" 或 "1) 項目" 格式
    return /^\d+[.)]\s/.test(item);
  }).length;

  // 如果大部分項目都是編號格式，則認為是編號列表
  return orderedCount >= sampleSize * 0.6;
}

/**
 * 解析 Markdown 語法並返回樣式信息
 * 支援的 Markdown 語法：
 * - **粗體** 或 __粗體__
 * - *斜體* 或 _斜體_
 * - [連結文字](URL)
 * @param text 原始文本
 * @returns 解析後的樣式信息
 */
export function parseMarkdownStyle(text: string): {
  content: string;
  style: 'normal' | 'bold' | 'italic' | 'link';
  href?: string;
} {
  // 安全檢查：確保 text 是有效的字串
  if (!text || typeof text !== 'string') {
    return {
      content: text || '',
      style: 'normal',
    };
  }

  // 檢查是否為連結 [文字](URL)
  const linkMatch = text.match(/^\[(.+?)\]\((.+?)\)$/);
  if (linkMatch) {
    return {
      content: linkMatch[1],
      style: 'link',
      href: linkMatch[2],
    };
  }

  // 檢查是否為粗體 **文字** 或 __文字__
  const boldMatch = text.match(/^(\*\*|__)(.+?)\1$/);
  if (boldMatch) {
    return {
      content: boldMatch[2],
      style: 'bold',
    };
  }

  // 檢查是否為斜體 *文字* 或 _文字_
  const italicMatch = text.match(/^(\*|_)(.+?)\1$/);
  if (italicMatch) {
    return {
      content: italicMatch[2],
      style: 'italic',
    };
  }

  // 預設為普通文字
  return {
    content: text,
    style: 'normal',
  };
}

/**
 * 解析列表項目的樣式和內容（使用 Markdown 語法）
 * @param item 原始項目字符串
 * @returns 解析後的項目信息
 */
export function parseListItemStyle(item: string): {
  content: string;
  style: 'normal' | 'bold' | 'italic' | 'link';
  href?: string;
} {
  // 移除編號前綴（如 "1. " 或 "1) "）
  const cleanItem = item.replace(/^\d+[.)]\s/, '');

  // 使用 Markdown 解析
  return parseMarkdownStyle(cleanItem);
}

/**
 * 渲染列表項目
 * @param items 列表項目數組
 * @param renderItem 渲染單個項目的函數
 * @returns JSX 元素數組
 */
export function renderListItems(
  items: string[],
  renderItem: (item: string, index: number) => React.ReactNode
): React.ReactNode[] {
  return items.map((item, index) => renderItem(item, index));
}
