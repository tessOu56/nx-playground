import type { ChartDataPoint } from '@nx-playground/charts';

// 活動創建趨勢 - 過去 30 天
export const eventTrendData: ChartDataPoint[] = [
  { label: '09/13', value: 5 },
  { label: '09/14', value: 7 },
  { label: '09/15', value: 3 },
  { label: '09/16', value: 8 },
  { label: '09/17', value: 6 },
  { label: '09/18', value: 9 },
  { label: '09/19', value: 12 },
  { label: '09/20', value: 8 },
  { label: '09/21', value: 10 },
  { label: '09/22', value: 6 },
  { label: '09/23', value: 11 },
  { label: '09/24', value: 13 },
  { label: '09/25', value: 9 },
  { label: '09/26', value: 15 },
  { label: '09/27', value: 12 },
  { label: '09/28', value: 14 },
  { label: '09/29', value: 10 },
  { label: '09/30', value: 16 },
  { label: '10/01', value: 13 },
  { label: '10/02', value: 18 },
  { label: '10/03', value: 15 },
  { label: '10/04', value: 20 },
  { label: '10/05', value: 17 },
  { label: '10/06', value: 19 },
  { label: '10/07', value: 22 },
  { label: '10/08', value: 21 },
  { label: '10/09', value: 23 },
  { label: '10/10', value: 25 },
  { label: '10/11', value: 24 },
  { label: '10/12', value: 28 },
];

// 用戶參與統計 - 各活動參與人數
export const participationData: ChartDataPoint[] = [
  { label: '春季音樂節', value: 250 },
  { label: '技術研討會', value: 180 },
  { label: '登山健行', value: 85 },
  { label: '美食品鑑', value: 120 },
  { label: '藝術展覽', value: 95 },
  { label: '路跑活動', value: 320 },
  { label: '攝影講座', value: 65 },
  { label: '瑜伽課程', value: 45 },
];

// 時間趨勢 - 報名趨勢（多條線）
interface TimeSeriesData extends ChartDataPoint {
  created: number;
  published: number;
  completed: number;
}

export const timeTrendData: TimeSeriesData[] = [
  { label: '第1週', value: 12, created: 12, published: 8, completed: 3 },
  { label: '第2週', value: 15, created: 15, published: 12, completed: 5 },
  { label: '第3週', value: 18, created: 18, published: 15, completed: 8 },
  { label: '第4週', value: 22, created: 22, published: 18, completed: 12 },
  { label: '第5週', value: 20, created: 20, published: 16, completed: 10 },
  { label: '第6週', value: 25, created: 25, published: 20, completed: 15 },
  { label: '第7週', value: 28, created: 28, published: 24, completed: 18 },
  { label: '第8週', value: 30, created: 30, published: 26, completed: 20 },
];

// 活動狀態分布
export const statusDistributionData: ChartDataPoint[] = [
  { label: '草稿', value: 35 },
  { label: '已發布', value: 48 },
  { label: '進行中', value: 12 },
  { label: '已完成', value: 78 },
  { label: '已取消', value: 8 },
];

// 生成隨機統計數據
export function generateMockChartData(days = 30): ChartDataPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    const value = Math.floor(Math.random() * 20) + 5;
    return { label, value };
  });
}
