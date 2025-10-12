import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nx-playground/ui-components';
import { format, parseISO, setHours, setMinutes, setSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { type EventFormValue } from '../../types';
import { useSessionStore } from '../../useEventStore';
import { Text } from '../core';

export function SessionEditBlock() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EventFormValue>();
  const { setHasError, setHasSession } = useSessionStore();
  const hasSession = useSessionStore(state => state.hasSession);
  const editingSessionId = useSessionStore(state => state.editingSessionId);
  const sessionBlocksRaw = useWatch({ control, name: 'sessionBlock' });
  const sessionBlocks = useMemo(
    () => sessionBlocksRaw || [],
    [sessionBlocksRaw]
  );

  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(
    null
  );

  // 更新 errors
  useEffect(() => {
    const haserror = !!(
      errors.sessionBlock?.length && errors.sessionBlock.length > 0
    );
    setHasError(haserror);
  }, [errors.sessionBlock, setHasError]);

  // 更新 hasSession
  useEffect(() => {
    setHasSession(sessionBlocks.length > 0);
  }, [sessionBlocks, setHasSession]);

  // 找到當前編輯的 session index
  useEffect(() => {
    if (!editingSessionId) {
      setEditingSessionIndex(null);
      return;
    }
    const idx = sessionBlocks.findIndex(s => s.id === editingSessionId);
    setEditingSessionIndex(idx !== -1 ? idx : null);
  }, [editingSessionId, sessionBlocks]);

  const editingSession =
    editingSessionIndex !== null ? sessionBlocks[editingSessionIndex] : null;

  // 時間選項
  const TimeOptions = useMemo(() => {
    const times = [
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
      '24:00',
    ];

    return times.map(time => {
      const [hour, minute] = time.split(':').map(Number);
      const baseDate = editingSession?.date
        ? parseISO(editingSession.date)
        : new Date();
      const dateWithTime = setSeconds(
        setMinutes(setHours(baseDate, hour), minute),
        0
      );
      // 使用 xxx 輸出 +08:00
      const timeStr = format(dateWithTime, 'HH:mm:ssxxx'); // HH:mm:ss+08:00
      return { label: time, value: timeStr };
    });
  }, [editingSession]);

  if (!hasSession || editingSessionIndex === null || !editingSession)
    return null;

  return (
    <div className='w-[360px] h-fit sticky top-0 p-6 gap-6 flex flex-col bg-background-primary'>
      <Text variant='title'>編輯場次</Text>

      <div className='flex flex-col gap-4'>
        {/* 場次名稱 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>場次名稱*</Text>
          <Controller
            key={editingSession.id}
            name={`sessionBlock.${editingSessionIndex}.name`}
            control={control}
            rules={{ required: '請輸入場次名稱' }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder='例如：台北場'
                className='rounded-md border border-border-primary p-3 gap-2.5'
              />
            )}
          />
          {errors.sessionBlock?.[editingSessionIndex]?.name && (
            <Text variant='content' color='red'>
              {
                errors.sessionBlock[editingSessionIndex]?.name
                  ?.message as string
              }
            </Text>
          )}
        </div>

        {/* 日期 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>日期*</Text>
          <Controller
            key={editingSession.id}
            name={`sessionBlock.${editingSessionIndex}.date`}
            control={control}
            rules={{ required: '請選擇日期' }}
            render={({ field }) => (
              <Input
                type='date'
                className='rounded-md border border-border-primary p-3 gap-2.5'
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value)}
              />
            )}
          />
        </div>

        {/* 開始時間 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>開始時間*</Text>
          <Controller
            key={`startTime-${editingSession.id}`}
            name={`sessionBlock.${editingSessionIndex}.startTime`}
            control={control}
            rules={{ required: '請選擇開始時間' }}
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={val => field.onChange(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='選擇開始時間' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {TimeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* 結束時間 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>結束時間*</Text>
          <Controller
            key={`endTime-${editingSession.id}`}
            name={`sessionBlock.${editingSessionIndex}.endTime`}
            control={control}
            rules={{ required: '請選擇結束時間' }}
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={val => field.onChange(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='選擇結束時間' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {TimeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* 人數上限 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>人數上限*</Text>
          <Controller
            key={editingSession.id}
            name={`sessionBlock.${editingSessionIndex}.capacityLimit`}
            control={control}
            rules={{ required: '請輸入人數上限' }}
            render={({ field }) => {
              const value = field.value ?? '';
              const isUnlimited = field.value === null;

              return (
                <div className='flex flex-col items-center gap-2'>
                  <Input
                    {...field}
                    type='number'
                    min={0}
                    value={value}
                    disabled={isUnlimited}
                    className={`rounded-md border border-border-primary p-3 flex-1 w-full ${
                      isUnlimited && 'bg-gray-300'
                    }`}
                    onChange={e =>
                      field.onChange(
                        e.target.value === '' ? 0 : Number(e.target.value)
                      )
                    }
                    placeholder={isUnlimited ? '不限人數' : '請輸入人數限制'}
                  />
                  <label className='flex w-full justify-start items-center gap-3 py-2'>
                    <Input
                      type='checkbox'
                      className='cursor-pointer rounded-md w-1 h-6'
                      checked={isUnlimited}
                      onChange={e =>
                        field.onChange(e.target.checked ? null : 0)
                      }
                    />
                    <Text variant='content'>不限人數</Text>
                  </label>
                </div>
              );
            }}
          />
          {errors.sessionBlock?.[editingSessionIndex]?.capacityLimit && (
            <Text variant='content' color='red'>
              {
                errors.sessionBlock[editingSessionIndex]?.capacityLimit
                  ?.message as string
              }
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
