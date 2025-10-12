import { Card, Input } from '@nx-playground/ui-components';
import { useFormContext } from 'react-hook-form';

import fakemap from '../../assets/fakemap.png';
import { EditingBlockEnum } from '../../types';
import { useEventStore } from '../../useEventStore';
import { Text } from '../core/index';

export function EventIntroduction() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const { editingBlock, setEditingBlock } = useEventStore();

  // 從 RHF 取得表單值
  const eventName = watch('eventName');
  const eventDescription = watch('eventDescription');
  const eventLocation = watch('eventLocation');

  return (
    <Card
      className='flex-1 flex py-4 flex-col items-center justify-center border rounded-xl cursor-pointer'
      onClick={() => setEditingBlock(EditingBlockEnum.Introduction)}
    >
      {editingBlock === 1 ? (
        // 編輯畫面
        <div className='flex w-full flex-col items-center justify-start px-4 py-6 gap-6'>
          <Text
            variant='title'
            className='text-2xl font-bold text-black text-start w-full'
          >
            活動總覽
          </Text>

          {/* 活動名稱 */}
          <div className='w-full flex flex-col gap-2'>
            <Text variant='content'>活動名稱 ＊</Text>
            <Input
              {...register('eventName')}
              placeholder='例如：人類野放計畫｜週末露營體驗'
            />
            {errors.eventName?.message && (
              <Text variant='content' color='red'>
                {errors.eventName.message.toString()}
              </Text>
            )}
            <Text variant='note' className='w-full text-start'>
              請輸入清晰且具描述性的活動名稱，讓參與者能立即了解活動主題。
            </Text>
          </div>

          {/* 活動簡介 */}
          <div className='w-full flex flex-col gap-2'>
            <Text variant='content'>活動簡介 ＊</Text>
            <Input
              {...register('eventDescription')}
              placeholder='例如：一場適合跟朋友揪團的戶外露營活動，學習野外技能和團隊合作，享受露營樂趣'
            />
            {errors.eventDescription?.message && (
              <Text variant='content' color='red'>
                {errors.eventDescription.message.toString()}
              </Text>
            )}
            <Text variant='note' className='w-full text-start'>
              請簡單說明活動主題與特色，幫助大家快速了解活動內容，並吸引更多人來參與。
            </Text>
          </div>

          {/* 地點設定 */}
          <div className='flex w-full flex-row items-start justify-between gap-6'>
            <div className='w-1/2 flex flex-col items-center justify-start gap-2'>
              <Text
                variant='content'
                className='text-text-primary w-full text-start'
              >
                活動地點 ＊
              </Text>
              <div className='w-full flex flex-row items-center justify-center border border-1 rounded-md gap-2.5 p-3'>
                <span className='w-5 h-5 rounded-full bg-gray-500 inline-block' />
                <Input
                  {...register('eventLocation')}
                  type='text'
                  placeholder='搜尋地點'
                  className='border-none'
                />
              </div>
              {errors.eventLocation?.message && (
                <Text
                  variant='content'
                  color='red'
                  className='w-full text-start'
                >
                  {errors.eventLocation.message.toString()}
                </Text>
              )}
              <Text variant='note' className='w-full text-start'>
                請輸入完整的活動地點名稱與地址，方便參與者找到活動會場
              </Text>
            </div>
            <div className='w-1/2 flex items-center justify-center'>
              <img
                src={fakemap}
                alt='地圖發生了一些問題'
                className='w-full h-[178px] rounded-lg object-cover'
              />
            </div>
          </div>
        </div>
      ) : (
        // 預覽畫面
        <div className='flex w-full flex-col items-center justify-start'>
          <Text variant='title' className='text-start w-full py-4 px-6'>
            {eventName === '' ? '活動名稱' : eventName}
          </Text>
          <Text variant='content' className='text-start w-full py-4 px-6'>
            {eventDescription === ''
              ? '請簡單說明活動主題與特色，幫助大家快速了解活動內容，並吸引更多人來參與。'
              : eventDescription}
          </Text>
          <div className='flex w-full flex-row items-start justify-center py-4 px-6 gap-6'>
            <div className='w-1/2 flex flex-row items-center justify-start gap-2'>
              <span className='w-5 h-5 rounded-full bg-gray-500 inline-block' />
              <Text variant='content'>
                {eventLocation === '' ? '加入地點' : eventLocation}
              </Text>
            </div>
            <div className='w-1/2 flex items-center justify-center'>
              <img
                src={fakemap}
                alt='地圖發生了一些問題'
                className='w-full h-[178px] rounded-lg object-cover'
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
