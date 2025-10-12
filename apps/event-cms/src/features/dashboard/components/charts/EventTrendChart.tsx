import { Recharts } from '@nx-playground/charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';

import { eventTrendData } from '../../mock/chartData';

export function EventTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          📈 活動創建趨勢
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-600 mb-4'>過去 30 天的活動創建數量</p>
        <Recharts.LineChart
          data={eventTrendData}
          height={280}
          colors={['#3b82f6']}
          showGrid={true}
          showDots={false}
        />
        <div className='mt-4 grid grid-cols-3 gap-4 text-center'>
          <div>
            <p className='text-2xl font-bold text-blue-600'>
              {eventTrendData[eventTrendData.length - 1].value}
            </p>
            <p className='text-xs text-gray-600'>今日創建</p>
          </div>
          <div>
            <p className='text-2xl font-bold text-green-600'>
              {eventTrendData.reduce((sum, d) => sum + d.value, 0)}
            </p>
            <p className='text-xs text-gray-600'>總計</p>
          </div>
          <div>
            <p className='text-2xl font-bold text-orange-600'>
              {Math.round(
                eventTrendData.reduce((sum, d) => sum + d.value, 0) /
                  eventTrendData.length
              )}
            </p>
            <p className='text-xs text-gray-600'>日均</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
