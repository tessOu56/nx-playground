import { Button } from '@nx-playground/ui-components';
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';

import { type EventFormValue, type SessionBlockType } from '../../types';
import { useSessionStore } from '../../useEventStore';
import { Text } from '../core';

export function SessionHeaderBlock() {
  const { trigger, setValue, control } = useFormContext<EventFormValue>();
  const hasError = useSessionStore(state => state.hasError);
  const hasSession = useSessionStore(state => state.hasSession);
  const { setEditingSessionId } = useSessionStore();
  const sessionBlocks: SessionBlockType[] =
    useWatch({ control, name: 'sessionBlock' }) || [];

  const handleAddSessionBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const isValid = await trigger('sessionBlock');
    if (!isValid) return;

    const now = new Date();
    const dateStr = format(now, 'yyyy-MM-dd'); // 2025-01-01

    const startDate = setSeconds(setMinutes(setHours(now, 8), 0), 0); //08:00:00
    const endDate = setSeconds(setMinutes(setHours(now, 23), 0), 0); // 23:00:00

    // 轉成 HH:mm:ss±HHmm 格式
    const startTimeStr = format(startDate, 'HH:mm:ssXXX'); // 08:00:00+08:00
    const endTimeStr = format(endDate, 'HH:mm:ssXXX'); // 23:00:00+08:00

    const newSession: SessionBlockType = {
      id: Date.now().toString(),
      name: '',
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      capacityLimit: 50,
    };
    setValue('sessionBlock', [...sessionBlocks, newSession]);
    setEditingSessionId(newSession.id);
  };

  return (
    <div className='w-full bg-background-primary items-center justify-between py-4 gap-2 flex flex-row'>
      <div className='w-fit flex flex-col gap-3'>
        <Text variant='title'>場次設定</Text>
        <Text variant='note'>建立活動的時間安排和場次資訊</Text>
      </div>
      <Button
        type='button'
        variant='primary'
        onClick={handleAddSessionBlock}
        className={`${
          hasSession ? 'flex' : 'hidden'
        } rounded-md py-2 px-8 gap-2.5`}
        disabled={hasError}
      >
        <Text variant='content' color='white'>
          + 新增場次
        </Text>
      </Button>
    </div>
  );
}
