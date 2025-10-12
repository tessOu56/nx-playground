import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PieChartProps } from '../types';

const DEFAULT_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];

export function PieChart({
  data,
  height = 300,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 80,
  colors = DEFAULT_COLORS,
  className = '',
}: PieChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width='100%' height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='label'
            cx='50%'
            cy='50%'
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            label={showLabels}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
