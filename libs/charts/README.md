# @nx-playground/charts

> React 圖表庫 - 雙軌制支援 Recharts 和 Chart.js

## 🎯 設計理念

提供統一的圖表介面，支援兩種流行的圖表庫：

- **Recharts** - React 原生，聲明式，適合簡單場景
- **Chart.js** - 功能強大，高性能，適合複雜場景

## 📦 安裝

此函式庫已整合到 nx-playground monorepo，無需單獨安裝。

## 🚀 使用方式

### 選擇圖表庫

```tsx
// 使用 Recharts (推薦用於簡單圖表)
import { Recharts } from '@nx-playground/charts';

<Recharts.LineChart data={data} />;

// 使用 Chart.js (推薦用於複雜圖表或需要高性能)
import { ChartJS } from '@nx-playground/charts';

<ChartJS.LineChart data={data} />;
```

## 📊 可用圖表

### LineChart - 折線圖

```tsx
import { Recharts } from '@nx-playground/charts';

const data = [
  { label: '1月', value: 120 },
  { label: '2月', value: 150 },
  { label: '3月', value: 180 },
];

<Recharts.LineChart
  data={data}
  height={300}
  showGrid={true}
  showDots={true}
  colors={['#3b82f6']}
/>;
```

### BarChart - 柱狀圖

```tsx
import { ChartJS } from '@nx-playground/charts';

const data = [
  { label: '產品 A', value: 250 },
  { label: '產品 B', value: 180 },
  { label: '產品 C', value: 320 },
];

<ChartJS.BarChart data={data} height={300} colors={['#10b981']} />;
```

### AreaChart - 面積圖

```tsx
import { Recharts } from '@nx-playground/charts';

const data = [
  { label: 'Q1', value: 1200 },
  { label: 'Q2', value: 1500 },
  { label: 'Q3', value: 1800 },
];

<Recharts.AreaChart
  data={data}
  height={300}
  filled={true}
  colors={['#8b5cf6']}
/>;
```

### PieChart - 圓餅圖

```tsx
import { ChartJS } from '@nx-playground/charts';

const data = [
  { label: '草稿', value: 30 },
  { label: '進行中', value: 50 },
  { label: '已完成', value: 15 },
  { label: '已取消', value: 5 },
];

<ChartJS.PieChart data={data} height={300} showLabels={true} />;
```

## 🎨 Props 參考

### 通用 Props

所有圖表都支援以下 props：

```typescript
interface BaseChartProps {
  data: ChartDataPoint[]; // 圖表數據
  width?: number | string; // 寬度（預設 100%）
  height?: number; // 高度（預設 300）
  title?: string; // 標題
  colors?: string[]; // 顏色數組
  className?: string; // CSS 類名
}
```

### LineChart 專屬

```typescript
interface LineChartProps extends BaseChartProps {
  showGrid?: boolean; // 顯示網格
  showDots?: boolean; // 顯示數據點
  smooth?: boolean; // 平滑曲線
  dataKey?: string; // 數據鍵名（預設 'value'）
}
```

### BarChart 專屬

```typescript
interface BarChartProps extends BaseChartProps {
  horizontal?: boolean; // 水平柱狀圖
  stacked?: boolean; // 堆疊柱狀圖
  dataKey?: string;
}
```

### AreaChart 專屬

```typescript
interface AreaChartProps extends BaseChartProps {
  showGrid?: boolean;
  filled?: boolean; // 填充面積
  dataKey?: string;
}
```

### PieChart 專屬

```typescript
interface PieChartProps extends BaseChartProps {
  showLabels?: boolean; // 顯示標籤
  innerRadius?: number; // 內半徑（甜甜圈圖）
  outerRadius?: number; // 外半徑
}
```

## 🤔 如何選擇

### 使用 Recharts 如果你需要：

- ✅ 簡單的圖表
- ✅ React 原生體驗
- ✅ 聲明式語法
- ✅ 較小的 bundle 大小

### 使用 Chart.js 如果你需要：

- ✅ 複雜的圖表配置
- ✅ 更高的性能（Canvas 渲染）
- ✅ 更多的圖表類型
- ✅ 與其他框架共享配置

## 💡 最佳實踐

1. **響應式設計** - 使用 `width="100%"` 讓圖表自適應容器
2. **顏色一致性** - 使用 Design System 的顏色 tokens
3. **數據格式** - 保持數據格式一致，使用 `{ label, value }` 結構
4. **Loading 狀態** - 在數據載入時顯示骨架屏或 spinner
5. **錯誤處理** - 當沒有數據時顯示友好提示

## 🎯 範例

查看 `apps/event-cms` 的 Dashboard 頁面，有完整的使用範例。

## 📚 外部文檔

- [Recharts Documentation](https://recharts.org/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [react-chartjs-2 Documentation](https://react-chartjs-2.js.org/)
