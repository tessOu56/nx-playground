/**
 * 格式化日期為中文格式
 * @param dateString 日期字串
 * @returns 格式化後的日期字串
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
