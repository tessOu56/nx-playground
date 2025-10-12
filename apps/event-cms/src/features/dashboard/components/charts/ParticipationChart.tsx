import { ChartJS } from '@nx-playground/charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';

import { participationData } from '../../mock/chartData';

export function ParticipationChart() {
  const totalParticipants = participationData.reduce(
    (sum, d) => sum + d.value,
    0
  );
  const avgParticipants = Math.round(
    totalParticipants / participationData.length
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          👥 用戶參與統計
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-600 mb-4'>各活動的參與人數排行</p>
        <ChartJS.BarChart
          data={participationData}
          height={280}
          colors={['#10b981']}
          dataKey='value'
        />
        <div className='mt-4 grid grid-cols-2 gap-4 text-center'>
          <div>
            <p className='text-2xl font-bold text-green-600'>
              {totalParticipants}
            </p>
            <p className='text-xs text-gray-600'>總參與人數</p>
          </div>
          <div>
            <p className='text-2xl font-bold text-blue-600'>
              {avgParticipants}
            </p>
            <p className='text-xs text-gray-600'>平均參與</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
