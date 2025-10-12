import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { PieChartProps } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  colors = DEFAULT_COLORS,
  title,
  className = '',
}: PieChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: colors,
        borderColor: colors.map(c => c),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      title: {
        display: !!title,
        text: title || '',
      },
    },
  };

  return (
    <div className={className} style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
