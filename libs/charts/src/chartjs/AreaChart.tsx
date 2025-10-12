import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { AreaChartProps } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AreaChart({
  data,
  height = 300,
  colors = ['#3b82f6'],
  title,
  dataKey = 'value',
  filled = true,
  className = '',
}: AreaChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: dataKey,
        data: data.map(d => d[dataKey]),
        borderColor: colors[0],
        backgroundColor: filled ? colors[0] + '40' : 'transparent',
        fill: filled,
        tension: 0.4,
      },
    ],
  };

  const options = {
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
      <Line data={chartData} options={options} />
    </div>
  );
}
