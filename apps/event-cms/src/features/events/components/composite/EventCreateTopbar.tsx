import { Button } from '@nx-playground/ui-components';
import { useNavigate } from 'react-router-dom';

import { Text } from '../core';

interface Props {
  handleSaveEvent: () => void;
}

export function EventCreateTopbar({ handleSaveEvent }: Props) {
  const navigate = useNavigate();
  return (
    <div className='bg-background-primary border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-text-primary'>
            {'新增活動'}
          </h1>
          <p className='text-sm text-text-secondary mt-1'>{'建立新的活動'}</p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/events')}
            className='px-4 py-2 text-sm text-gray-600 hover:text-text-primary'
          >
            <Text variant='content'>取消</Text>
          </Button>
          <Button
            type='button'
            variant='primary'
            onClick={() => {
              handleSaveEvent();
            }}
            className='px-4 py-2 text-text-primary rounded-lg hover:bg-blue-700'
          >
            <Text variant='content' color='white'>
              儲存活動
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
}
