import { Input } from '@nx-playground/ui-components';
import { Controller, useFormContext } from 'react-hook-form';

import { type EventFormValue } from '../../types';
import { Text } from '../core';

export function VisibilityBlock() {
  const { control } = useFormContext<EventFormValue>();

  return (
    <div className='w-full flex flex-col h-fit'>
      <div className='flex flex-row justify-between py-4'>
        <div className='flex flex-col gap-2'>
          <Text variant='title'>設定活動能見度</Text>
          <Text variant='note'>設定要將活動分享給哪些對象</Text>
        </div>
      </div>

      <Controller
        name='visibility'
        key={'event-visibility-option'}
        control={control}
        render={({ field }) => {
          const onClick = (type: string) => {
            field.onChange(type);
          };
          return (
            <div className='flex flex-col gap-4'>
              {/* 公開活動 */}
              <div
                className='flex flex-row gap-3 items-start p-4 border rounded-md cursor-pointer'
                onClick={() => onClick('public')}
              >
                <Input
                  type='radio'
                  {...field}
                  checked={field.value === 'public'}
                  className='w-5 h-5 rounded-full'
                />
                <div className='flex flex-col'>
                  <Text variant='content'>公開活動</Text>
                  <Text variant='note'>任何人都可以搜尋到您的活動並報名。</Text>
                </div>
              </div>

              {/* 私人活動 */}
              <div
                className='flex flex-row gap-3 items-start p-4 border rounded-md cursor-pointer'
                onClick={() => onClick('private')}
              >
                <Input
                  type='radio'
                  {...field}
                  checked={field.value === 'private'}
                  className='w-5 h-5 rounded-full'
                />
                <div className='flex flex-col'>
                  <Text variant='content'>私人活動</Text>
                  <Text variant='note'>只有知道活動連結的人才能報名。</Text>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
