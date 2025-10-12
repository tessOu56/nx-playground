export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export interface BaseChartProps {
  data: ChartDataPoint[];
  width?: number | string;
  height?: number;
  title?: string;
  colors?: string[];
  className?: string;
}

export interface LineChartProps extends BaseChartProps {
  showGrid?: boolean;
  showDots?: boolean;
  smooth?: boolean;
  dataKey?: string;
}

export interface BarChartProps extends BaseChartProps {
  horizontal?: boolean;
  stacked?: boolean;
  dataKey?: string;
}

export interface AreaChartProps extends BaseChartProps {
  showGrid?: boolean;
  filled?: boolean;
  dataKey?: string;
}

export interface PieChartProps extends BaseChartProps {
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}
