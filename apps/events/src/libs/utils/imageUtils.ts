/**
 * 生成 Lorem Picsum 圖片 URL
 * @param width 圖片寬度
 * @param height 圖片高度
 * @param seed 可選的種子值，用於生成一致的圖片
 * @returns 圖片 URL
 */
export const getLoremPicsumUrl = (
  width: number,
  height: number,
  seed?: string | number
): string => {
  const baseUrl = 'https://picsum.photos';
  const size = `${width}/${height}`;

  if (seed) {
    return `${baseUrl}/seed/${seed}/${size}`;
  }

  return `${baseUrl}/${size}`;
};

/**
 * 生成活動封面圖片 URL
 * @param eventId 活動 ID，用作種子值
 * @returns 活動封面圖片 URL
 */
export const getEventCoverUrl = (eventId: string): string => {
  return getLoremPicsumUrl(400, 300, eventId);
};

/**
 * 生成主辦方頭像圖片 URL
 * @param vendorId 主辦方 ID，用作種子值
 * @returns 主辦方頭像圖片 URL
 */
export const getVendorAvatarUrl = (vendorId: string): string => {
  return getLoremPicsumUrl(200, 200, vendorId);
};
