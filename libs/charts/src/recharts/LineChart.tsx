import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { LineChartProps } from '../types';

export function LineChart({
  data,
  height = 300,
  showGrid = true,
  showDots = true,
  colors = ['#3b82f6'],
  dataKey = 'value',
  className = '',
}: LineChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width='100%' height={height}>
        <RechartsLineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray='3 3' />}
          <XAxis dataKey='label' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey={dataKey}
            stroke={colors[0]}
            dot={showDots}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
