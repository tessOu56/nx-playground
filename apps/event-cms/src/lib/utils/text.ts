/**
 * 截斷文字並添加省略號
 * @param text 要截斷的文字
 * @param maxLength 最大長度，預設為 10
 * @returns 截斷後的文字
 */
export const truncateText = (text: string, maxLength = 10): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
