import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { BarChartProps } from '../types';

export function BarChart({
  data,
  height = 300,
  colors = ['#3b82f6'],
  dataKey = 'value',
  className = '',
}: BarChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width='100%' height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='label' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={colors[0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
