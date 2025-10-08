export function parseDate(dateInput?: Date | string) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return {
    date,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: weekdays[date.getDay()],
  };
}
