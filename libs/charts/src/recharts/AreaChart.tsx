import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AreaChartProps } from '../types';

export function AreaChart({
  data,
  height = 300,
  showGrid = true,
  filled = true,
  colors = ['#3b82f6'],
  dataKey = 'value',
  className = '',
}: AreaChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width='100%' height={height}>
        <RechartsAreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray='3 3' />}
          <XAxis dataKey='label' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type='monotone'
            dataKey={dataKey}
            stroke={colors[0]}
            fill={filled ? colors[0] : 'none'}
            fillOpacity={0.6}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
