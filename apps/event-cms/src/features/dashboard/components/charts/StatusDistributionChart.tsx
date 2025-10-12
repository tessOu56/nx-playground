import { ChartJS } from '@nx-playground/charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';

import { statusDistributionData } from '../../mock/chartData';

export function StatusDistributionChart() {
  const total = statusDistributionData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          🥧 活動狀態分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-600 mb-4'>當前所有活動的狀態統計</p>
        <ChartJS.PieChart
          data={statusDistributionData}
          height={280}
          colors={['#94a3b8', '#3b82f6', '#f59e0b', '#10b981', '#ef4444']}
        />
        <div className='mt-4 text-center'>
          <p className='text-2xl font-bold text-gray-900'>{total}</p>
          <p className='text-xs text-gray-600'>總活動數</p>
        </div>
      </CardContent>
    </Card>
  );
}
