import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nx-playground/ui-components';
import { parseISO, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { useTicketStore } from '../../stores';
import { type SessionBlockType, type EventFormValue } from '../../types';
import { calculateOffsetSaleTime } from '../../utils/ticketoffsetCalculate';
import { Text } from '../core';

export function TicketEditBlock() {
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<EventFormValue>();

  const { setHasError, setHasTicket } = useTicketStore();
  const hasTicket = useTicketStore(state => state.hasTicket);
  const editingTicketId = useTicketStore(state => state.editingTicketId);
  const ticketBlock = useWatch({ control, name: 'ticketBlock' });

  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(
    null
  );
  const sessionBlock = getValues('sessionBlock');

  // 偵測是否有錯誤
  useEffect(() => {
    setHasError(!!errors.ticketBlock?.length);
  }, [errors.ticketBlock, setHasError]);

  // 判斷是否有ticket
  useEffect(() => {
    setHasTicket(ticketBlock.length > 0);
  }, [ticketBlock.length, setHasTicket]);

  // 取得指定id的ticket index
  useEffect(() => {
    if (!editingTicketId) {
      setEditingTicketIndex(null);
      return;
    }
    const idx = ticketBlock.findIndex(t => t.id === editingTicketId);
    setEditingTicketIndex(idx !== -1 ? idx : null);
  }, [ticketBlock, editingTicketId]);

  if (!hasTicket || editingTicketIndex === null) return null;
  const editingTicket = ticketBlock[editingTicketIndex];
  if (!editingTicket) return null;

  // 將 ISO 轉成 {date, time} 物件
  const parseLocal = (str?: string) => {
    if (!str) return { date: '', time: '' };
    const d = parseISO(str);
    return {
      date: format(d, 'yyyy-MM-dd'),
      time: format(d, 'HH:mm'),
    };
  };

  // 合成 ISO 字串
  const combineDateTime = (date: string, time: string) => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    const newdate = format(d, 'yyyy-MM-dd');
    const newtime = format(d, 'HH:mm:ssxxx');

    return `${newdate}T${newtime}`;
  };

  return (
    <div className='h-full min-h-screen flex flex-col w-[360px] gap-6 p-6'>
      <Text variant='title'>編輯票券</Text>

      <div className='w-full flex flex-col gap-6'>
        {/* 場次名稱 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>票券名稱*</Text>
          <Controller
            key={`ticketName-${editingTicket.id}`}
            name={`ticketBlock.${editingTicketIndex}.name`}
            control={control}
            rules={{ required: '請輸入票券名稱' }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder='例如：台北場'
              />
            )}
          />
          {errors.ticketBlock?.[editingTicketIndex]?.name && (
            <Text variant='content' color='red'>
              {errors.ticketBlock[editingTicketIndex]?.name?.message as string}
            </Text>
          )}
        </div>

        {/* 票價 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>票價*</Text>
          <Controller
            key={`ticketPrice-${editingTicket.id}`}
            name={`ticketBlock.${editingTicketIndex}.price`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type='number'
                value={field.value ?? 0}
                placeholder='0'
                min={0}
                max={3000000}
                onChange={e =>
                  field.onChange(
                    e.target.value === '' ? 0 : Number(e.target.value)
                  )
                }
              />
            )}
          />
          {errors.ticketBlock?.[editingTicketIndex]?.price && (
            <Text variant='content' color='red'>
              {errors.ticketBlock[editingTicketIndex]?.price?.message as string}
            </Text>
          )}
        </div>

        {/* 適用場次 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>適用場次＊</Text>
          <Controller
            key={`ticketSessions-${editingTicket.id}`}
            name={`ticketBlock.${editingTicketIndex}.saleTime`}
            control={control}
            render={({ field }) => {
              const selectedIds = field.value.map(i => i.sessionId);
              const allIds = sessionBlock.map(s => s.id);
              const allSelected = selectedIds.length === allIds.length;

              // 全部選擇
              const toggleAll = () => {
                if (allSelected) {
                  field.onChange([]);
                  return;
                } else {
                  if (editingTicket.saleTimeType === true) {
                    const newSaleTime = sessionBlock.map(s => {
                      const saleStartTime =
                        editingTicket.globalTime?.commonStartTime ??
                        `${s.date}T${s.startTime}`;
                      const saleEndTime =
                        editingTicket.globalTime?.commonEndTime ??
                        `${s.date}T${s.endTime}`;
                      return {
                        sessionId: s.id,
                        startTime: saleStartTime,
                        endTime: saleEndTime,
                      };
                    });
                    field.onChange(newSaleTime);
                  } else {
                    const newSaleTime = sessionBlock.map(s => ({
                      sessionId: s.id,
                      startTime: `${s.date}T${s.startTime}`,
                      endTime: `${s.date}T${s.endTime}`,
                    }));
                    field.onChange(newSaleTime);
                  }
                }
              };

              // 選擇一項
              const toggleOne = (
                session: SessionBlockType,
                checked: boolean
              ) => {
                const newSaleTime = {
                  sessionId: session.id,
                  startTime:
                    editingTicket.globalTime?.commonStartTime ??
                    `${session.date}T${session.startTime}`,
                  endTime:
                    editingTicket.globalTime?.commonEndTime ??
                    `${session.date}T${session.endTime}`,
                };
                if (checked) field.onChange([...field.value, newSaleTime]);
                else
                  field.onChange(
                    field.value.filter(i => i.sessionId !== session.id)
                  );
              };
              return (
                <div className='flex flex-col gap-2'>
                  <label className='flex items-center gap-2'>
                    <Input
                      type='checkbox'
                      checked={allSelected}
                      onChange={toggleAll}
                      className='w-4 h-4'
                    />
                    <Text variant='content'>全部場次</Text>
                  </label>

                  {sessionBlock.map(s => (
                    <div key={s.id} className='flex items-center gap-2'>
                      <Input
                        type='checkbox'
                        checked={selectedIds.includes(s.id)}
                        onChange={e => toggleOne(s, e.target.checked)}
                        className='w-4 h-4'
                      />
                      <Text variant='content'>{s.name}</Text>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </div>

        {/* 數量 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>數量*</Text>
          <Controller
            key={editingTicket.id}
            name={`ticketBlock.${editingTicketIndex}.count`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type='number'
                min={1}
                max={100000}
                value={field.value ?? 1}
                onChange={e =>
                  field.onChange(
                    e.target.value === '' ? 1 : Number(e.target.value)
                  )
                }
              />
            )}
          />
        </div>

        {/* 售票狀態 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>售票狀態*</Text>
          <Controller
            key={`ticketState-${editingTicket.id}`}
            name={`ticketBlock.${editingTicketIndex}.state`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={val => field.onChange(val === 'true')}
              >
                <SelectTrigger className='bg-white text-left'>
                  <SelectValue placeholder='選擇選項' />
                </SelectTrigger>
                <SelectContent className='bg-white cursor-pointer'>
                  <SelectItem value='true'>
                    <Text variant='content'>發售</Text>
                  </SelectItem>
                  <SelectItem value='false'>
                    <Text variant='content'>停售</Text>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* 售票時間 */}
        <div className='gap-2 flex flex-col'>
          <Text variant='content'>售票時間*</Text>
          <Controller
            key={`saleTimeType-${editingTicket.id}`}
            name={`ticketBlock.${editingTicketIndex}.saleTimeType`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={val => field.onChange(val === 'true')}
              >
                <SelectTrigger className='bg-white text-left'>
                  <SelectValue placeholder='選擇選項' />
                </SelectTrigger>
                <SelectContent className='bg-white cursor-pointer'>
                  <SelectItem value='true'>
                    <Text variant='content'>統一時間</Text>
                  </SelectItem>
                  <SelectItem value='false'>
                    <Text variant='content'>分時段</Text>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* 統一時間 */}
        {editingTicket.saleTimeType && (
          <Controller
            key={`globalTime-${editingTicket.id}`}
            name={`ticketBlock.${editingTicketIndex}.globalTime`}
            control={control}
            render={({ field }) => {
              const startLocal = parseLocal(field.value?.commonStartTime);
              const endLocal = parseLocal(field.value?.commonEndTime);

              const handleChange = (
                type: 'start' | 'end',
                date?: string,
                time?: string
              ) => {
                const old = parseISO(new Date().toISOString());
                const newDate = date ?? format(old, 'yyyy-MM-dd');
                const newTime = time ?? format(old, 'HH:mm');
                const updated = combineDateTime(newDate, newTime);

                // 更新 globalTime 物件
                const newGlobalTime = {
                  ...field.value,
                  ...(type === 'start'
                    ? { commonStartTime: updated }
                    : { commonEndTime: updated }),
                };

                // 同步更新表單值
                field.onChange(newGlobalTime);
              };

              return (
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1'>
                    <Text variant='content'>開始日期</Text>
                    <Input
                      type='date'
                      value={startLocal.date}
                      onChange={e =>
                        handleChange('start', e.target.value, undefined)
                      }
                    />
                    <Text variant='content'>開始時間</Text>
                    <Input
                      type='time'
                      value={startLocal.time}
                      onChange={e =>
                        handleChange('start', undefined, e.target.value)
                      }
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Text variant='content'>結束日期</Text>
                    <Input
                      type='date'
                      value={endLocal.date}
                      onChange={e =>
                        handleChange('end', e.target.value, undefined)
                      }
                    />
                    <Text variant='content'>結束時間</Text>
                    <Input
                      type='time'
                      value={endLocal.time}
                      onChange={e =>
                        handleChange('end', undefined, e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            }}
          />
        )}

        {/* 分時段 */}
        {!editingTicket.saleTimeType && (
          <div className='flex flex-col gap-2'>
            <Text variant='content'>開始前</Text>
            <div className='flex gap-2'>
              {/* 數值 */}
              <Controller
                key={`startOffset-${editingTicket.id}`}
                name={`ticketBlock.${editingTicketIndex}.offset.startOffset`}
                control={control}
                render={({ field }) => (
                  <Input
                    type='number'
                    min={0}
                    {...field}
                    value={field.value}
                    onChange={e => {
                      const newStart = editingTicket.saleTime.map(item =>
                        calculateOffsetSaleTime({
                          sessionBlock,
                          item,
                          type: 'start',
                          offset: Number(e.target.value),
                          offsetBase:
                            editingTicket.offset?.startOffsetBase || 1440,
                        })
                      );
                      setValue(
                        `ticketBlock.${editingTicketIndex}.saleTime`,
                        newStart,
                        { shouldValidate: true }
                      );
                      setValue(
                        `ticketBlock.${editingTicketIndex}.offset.startOffset`,
                        Number(e.target.value),
                        { shouldValidate: true }
                      );
                    }}
                  />
                )}
              />
              {/* 單位 */}
              <Controller
                key={`startOffsetBase-${editingTicket.id}`}
                name={`ticketBlock.${editingTicketIndex}.offset.startOffsetBase`}
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={val => {
                      const newBase = Number(val);

                      const newStart = editingTicket.saleTime.map(item =>
                        calculateOffsetSaleTime({
                          sessionBlock,
                          item,
                          type: 'start',
                          offset: editingTicket.offset?.startOffset || 1,
                          offsetBase: newBase,
                        })
                      );

                      setValue(
                        `ticketBlock.${editingTicketIndex}.offset.startOffsetBase`,
                        newBase,
                        { shouldValidate: true }
                      );
                      setValue(
                        `ticketBlock.${editingTicketIndex}.saleTime`,
                        newStart,
                        { shouldValidate: true }
                      );

                      field.onChange(newBase);
                    }}
                  >
                    <SelectTrigger className='w-[148px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white cursor-pointer'>
                      <SelectItem value='1440'>
                        <Text variant='content'>天</Text>
                      </SelectItem>
                      <SelectItem value='60'>
                        <Text variant='content'>小時</Text>
                      </SelectItem>
                      <SelectItem value='1'>
                        <Text variant='content'>分鐘</Text>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Text variant='content'>結束前</Text>
            <div className='flex gap-2'>
              {/* 數值 */}
              <Controller
                key={`endOffset-${editingTicket.id}`}
                name={`ticketBlock.${editingTicketIndex}.offset.endOffset`}
                control={control}
                render={({ field }) => (
                  <Input
                    type='number'
                    min={0}
                    {...field}
                    value={field.value}
                    onChange={e => {
                      const newEnd = editingTicket.saleTime.map(item =>
                        calculateOffsetSaleTime({
                          sessionBlock,
                          item,
                          type: 'end',
                          offset: Number(e.target.value),
                          offsetBase:
                            editingTicket.offset?.endOffsetBase || 1440,
                        })
                      );
                      setValue(
                        `ticketBlock.${editingTicketIndex}.saleTime`,
                        newEnd,
                        { shouldValidate: true }
                      );
                      setValue(
                        `ticketBlock.${editingTicketIndex}.offset.endOffset`,
                        Number(e.target.value),
                        { shouldValidate: true }
                      );
                    }}
                  />
                )}
              />
              {/* 單位 */}
              <Controller
                key={`endOffsetBase-${editingTicket.id}`}
                name={`ticketBlock.${editingTicketIndex}.offset.endOffsetBase`}
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={val => {
                      const newBase = Number(val);

                      const newEnd = editingTicket.saleTime.map(item =>
                        calculateOffsetSaleTime({
                          sessionBlock,
                          item,
                          type: 'end',
                          offset: editingTicket.offset?.endOffset || 1,
                          offsetBase: newBase,
                        })
                      );

                      setValue(
                        `ticketBlock.${editingTicketIndex}.offset.endOffsetBase`,
                        newBase,
                        { shouldValidate: true }
                      );
                      setValue(
                        `ticketBlock.${editingTicketIndex}.saleTime`,
                        newEnd,
                        { shouldValidate: true }
                      );

                      field.onChange(newBase);
                    }}
                  >
                    <SelectTrigger className='w-[148px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white cursor-pointer'>
                      <SelectItem value='1440'>
                        <Text variant='content'>天</Text>
                      </SelectItem>
                      <SelectItem value='60'>
                        <Text variant='content'>小時</Text>
                      </SelectItem>
                      <SelectItem value='1'>
                        <Text variant='content'>分鐘</Text>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
