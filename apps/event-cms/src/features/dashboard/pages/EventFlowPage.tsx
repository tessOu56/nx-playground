import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';
import { Workflow } from 'lucide-react';

import { SEO } from '../../../components/SEO';
import { EventWorkflowFlow } from '../components/flow/EventWorkflowFlow';

/**
 * 活動流程視覺化頁（React Flow POC）
 */
export function EventFlowPage() {
  return (
    <>
      <SEO
        title='活動流程視覺化'
        description='以節點圖檢視活動從草稿到結案的審核流程'
      />
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-text-primary flex items-center gap-2'>
            <Workflow className='w-6 h-6' />
            活動流程視覺化
          </h1>
          <p className='text-sm text-gray-600 mt-1'>
            活動從草稿到結案的完整審核流程；可拖曳節點、縮放畫布。
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>審核流程總覽</CardTitle>
          </CardHeader>
          <CardContent>
            <EventWorkflowFlow />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
