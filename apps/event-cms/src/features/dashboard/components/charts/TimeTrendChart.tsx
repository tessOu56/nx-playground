import { Recharts } from '@nx-playground/charts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';

import { timeTrendData } from '../../mock/chartData';

export function TimeTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          📊 時間趨勢總覽
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-600 mb-4'>
          活動生命週期趨勢（創建 → 發布 → 完成）
        </p>
        <Recharts.AreaChart
          data={timeTrendData}
          height={280}
          colors={['#8b5cf6']}
          filled={true}
          dataKey='value'
        />
        <div className='mt-4 flex gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-purple-600' />
            <span className='text-gray-600'>總活動數</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-blue-500' />
            <span className='text-gray-600'>已創建</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-green-500' />
            <span className='text-gray-600'>已發布</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-orange-500' />
            <span className='text-gray-600'>已完成</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
