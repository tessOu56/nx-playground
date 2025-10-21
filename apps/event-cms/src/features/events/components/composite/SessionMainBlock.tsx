import { Button, useToast } from '@nx-playground/ui-components';
import { format, setHours, setMinutes, setSeconds } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';

import { formatDate } from '../../../../lib/utils';
import { parseDate, useSortSessions } from '../../hooks';
import { useSessionStore } from '../../stores';
import { type EventFormValue, type SessionBlockType } from '../../types';
import { Text } from '../core';

export function SessionMainBlock() {
  const { control, setValue, trigger, getValues } =
    useFormContext<EventFormValue>();
  const sessionBlocks: SessionBlockType[] =
    useWatch({ control, name: 'sessionBlock' }) || [];

  const { setHasSession, setEditingSessionId, setHasError } = useSessionStore();
  const hasError = useSessionStore(state => state.hasError);
  const editingSessionId = useSessionStore(state => state.editingSessionId);
  const { addToast } = useToast();

  const { sortedSessions, orderedDates, groupedSessions } =
    useSortSessions(sessionBlocks);

  const handleAddSessionBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    const dateStr = format(now, 'yyyy-MM-dd'); // 2025-01-01

    const startDate = setSeconds(setMinutes(setHours(now, 8), 0), 0); // 08:00:00
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

    setValue('sessionBlock', [...sessionBlocks, newSession], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setHasSession(true);
    setEditingSessionId(newSession.id);
  };

  const handleRemove = (id: string) => {
    const target = sortedSessions.find(
      (item: SessionBlockType) => item.id === id
    );
    if (!target) return;

    const newBlocks = sortedSessions.filter(
      (item: SessionBlockType) => item.id !== id
    );
    setValue('sessionBlock', newBlocks, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (newBlocks.length === 0) {
      setHasSession(false);
      setHasError(false);
    } else {
      trigger('sessionBlock').then(isValid => setHasError(!isValid));
    }

    addToast({
      message: '場次已刪除。',
      type: 'success',
      action: {
        label: '復原',
        onClick: () => {
          const latest = getValues('sessionBlock') as SessionBlockType[];
          setValue('sessionBlock', [...latest, target], {
            shouldValidate: true,
            shouldDirty: true,
          });
          setHasSession(true);
          trigger('sessionBlock').then(isValid => setHasError(!isValid));
        },
      },
    });
  };

  const handleClickSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (hasError) return;
    setEditingSessionId(id);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasError) return;
    setEditingSessionId(null);
  };

  return (
    <div
      className='flex-1 flex flex-col items-center w-full'
      onClick={handleClickOutside}
    >
      {sortedSessions.length === 0 ? (
        <div className='gap-10 flex flex-col items-center'>
          <Text variant='content'>
            目前還沒有任何場次，來建立第一場場次吧！
          </Text>
          <Button
            type='button'
            variant='primary'
            onClick={handleAddSessionBlock}
            className='rounded-md px-18 py-3 gap-2.5 w-fit'
            disabled={hasError}
          >
            <Text variant='content' color='white'>
              + 新增場次
            </Text>
          </Button>
        </div>
      ) : (
        <div className='w-full flex flex-col py-4 gap-6 relative'>
          <div className='w-full flex justify-end items-center'>
            <Text variant='content'>全部場次 ({sortedSessions.length})</Text>
          </div>

          {orderedDates.map(date => {
            const sessions = groupedSessions[date] || [];
            const parseDateObj = parseDate(date);
            return (
              <div
                key={date}
                className='w-full flex  items-start flex-row gap-6'
              >
                <div className='flex flex-col items-center justify-center gap-2 w-[60px] py-4'>
                  <Text variant='content'>
                    {parseDateObj.month}/{parseDateObj.day}
                  </Text>
                  <Text variant='content'>星期{parseDateObj.weekday}</Text>
                </div>
                <div className='w-4 h-full flex py-8  justify-center relative'>
                  <span className='w-4 h-4 inline-block bg-gray-300 rounded-full' />
                  <div className='h-[125%] border-2 absolute top-8 border-dashed border-gray-300' />
                </div>
                <div className='flex flex-col gap-4 py-4 w-full'>
                  {sessions.map((item: SessionBlockType) => {
                    const start = `${item.date}T${item.startTime}`;
                    const end = `${item.date}T${item.endTime}`;

                    return (
                      <div
                        key={item.id}
                        className={`h-[64px] rounded-xl border border-border-primary px-6 py-4 gap-6 flex flex-row items-center justify-between w-full cursor-pointer ${
                          item.id === editingSessionId ? 'bg-gray-200' : ''
                        }`}
                        onClick={e => handleClickSession(e, item.id)}
                      >
                        <div className='gap-6 flex items-center'>
                          <Text variant='content' className='w-fit'>
                            {formatDate(start).slice(-7)} -{' '}
                            {formatDate(end).slice(-7)}
                          </Text>
                          <Text variant='title'>{item.name}</Text>
                        </div>

                        <div className='gap-6 w-fit flex items-center'>
                          <Text variant='content'>
                            {item.capacityLimit
                              ? `限${item.capacityLimit}人`
                              : '不限人數'}
                          </Text>
                          <Button
                            type='button'
                            variant='primary'
                            className='w-9 h-9 rounded-full'
                            onClick={() => handleRemove(item.id)}
                          >
                            <Text variant='content' color='white'>
                              刪除
                            </Text>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
