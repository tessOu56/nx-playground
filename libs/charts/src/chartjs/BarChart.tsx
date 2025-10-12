import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { BarChartProps } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart({
  data,
  height = 300,
  colors = ['#3b82f6'],
  title,
  dataKey = 'value',
  horizontal = false,
  className = '',
}: BarChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: dataKey,
        data: data.map(d => d[dataKey]),
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: !!title,
        text: title || '',
      },
    },
  };

  return (
    <div className={className} style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
