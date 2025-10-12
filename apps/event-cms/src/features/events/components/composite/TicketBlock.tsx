import { Button, useToast } from '@nx-playground/ui-components';
import { parseISO, format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  type EventFormValue,
  type SessionBlockType,
  type TicketBlockType,
} from '../../types';
import { useTicketStore } from '../../useEventStore';
import { Text } from '../core';

type Props = { item: TicketBlockType; sessionBlock: SessionBlockType[] };

export function TicketBlock({ item, sessionBlock }: Props) {
  const { setEditingTicketId, setHasTicket, setHasError } = useTicketStore();
  const { control, setValue, trigger, getValues } =
    useFormContext<EventFormValue>();
  const ticketBlock: TicketBlockType[] =
    useWatch({ control, name: 'ticketBlock' }) ?? [];
  const editingTicketId = useTicketStore(state => state.editingTicketId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [startOffsetUnit, setStartOffsetUnit] = useState('天');
  const [endOffsetUnit, setEndOffsetUnit] = useState('天');
  const { addToast } = useToast();

  // 適用場次
  const matchedSessions = sessionBlock.filter(
    s =>
      Array.isArray(item.saleTime) &&
      item.saleTime.some(st => st.sessionId === s.id)
  );

  // 計算隱藏的 session
  useEffect(() => {
    const calculateHidden = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const items = Array.from(container.children).filter(child =>
        child.classList.contains('session-item')
      ) as HTMLDivElement[];

      let totalWidth = 0;
      let visible = items.length;
      for (let i = 0; i < items.length; i++) {
        totalWidth += items[i].offsetWidth + 12;
        if (totalWidth > containerWidth) {
          visible = i;
          break;
        }
      }
      setHiddenCount(items.length - visible);
    };

    calculateHidden();
    window.addEventListener('resize', calculateHidden);
    return () => window.removeEventListener('resize', calculateHidden);
  }, [matchedSessions]);

  // 偏移單位轉換
  useEffect(() => {
    switch (item.offset.startOffsetBase) {
      case 1440:
        setStartOffsetUnit('天');
        break;
      case 60:
        setStartOffsetUnit('小時');
        break;
      case 1:
        setStartOffsetUnit('分鐘');
        break;
    }
    switch (item.offset.endOffsetBase) {
      case 1440:
        setEndOffsetUnit('天');
        break;
      case 60:
        setEndOffsetUnit('小時');
        break;
      case 1:
        setEndOffsetUnit('分鐘');
        break;
    }
  }, [item.offset]);

  const handleClickTicket = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEditingTicketId(id);
  };

  const handleRemove = (id: string) => {
    const target = ticketBlock?.find(item => item.id === id);
    if (!target) return;

    const newBlocks = ticketBlock.filter(item => item.id !== id);
    setValue('ticketBlock', newBlocks, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (newBlocks.length === 0) {
      setHasTicket(false);
      setHasError(false);
    } else {
      trigger('ticketBlock').then(isValid => setHasError(!isValid));
    }

    addToast({
      message: '票券已刪除。',
      type: 'success',
      action: {
        label: '復原',
        onClick: () => {
          const latest = getValues('ticketBlock') || [];
          setValue('ticketBlock', [...latest, target], {
            shouldValidate: true,
            shouldDirty: true,
          });
          setHasTicket(true);
          trigger('ticketBlock').then(isValid => setHasError(!isValid));
        },
      },
    });
  };

  const handleCopy = (ticket: TicketBlockType) => {
    const currentTickets = getValues('ticketBlock') || [];

    const baseNameMatch = ticket.name.match(/^(.*?)(?:\s\((\d+)\))?$/);
    const baseName = baseNameMatch?.[1] ?? ticket.name;

    let maxIndex = 0;
    const regex = new RegExp(
      `^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\((\\d+)\\)$`
    );

    currentTickets.forEach(t => {
      const match = t.name.match(regex);
      if (match?.[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxIndex) maxIndex = num;
      }
    });

    const newName = `${baseName} (${maxIndex + 1})`;
    const newTicket = {
      ...ticket,
      id: crypto.randomUUID(),
      name: newName,
      saleTimeType: ticket.saleTimeType ?? true,
      saleTime: ticket.saleTime ?? [],
    };

    setValue('ticketBlock', [...currentTickets, newTicket], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setHasTicket(true);
    trigger('ticketBlock').then(isValid => setHasError(!isValid));

    addToast({ message: '票券已複製', type: 'success' });
  };

  return (
    <div
      className={`flex flex-col w-full max-w-[836px] overflow-hidden border rounded-xl p-6 gap-4 ${
        editingTicketId === item.id
          ? 'bg-background-secondary'
          : 'bg-background-primarys'
      }`}
      onClick={e => handleClickTicket(e, item.id)}
    >
      {/* Header */}
      <div className='w-full flex flex-row justify-between items-center'>
        <div className='flex flex-row items-center justify-start gap-4'>
          {item.state === false && (
            <Text
              variant='content'
              color='white'
              className='bg-black py-1 px-4 gap-2.5 rounded-xs font-bold'
            >
              停售
            </Text>
          )}
          <Text variant='title'>{item.name}</Text>
          <Text variant='title'>${item.price}</Text>
          <Text
            variant='content'
            className='px-3 py-1 rounded-full gap-2.5 bg-white'
          >
            {item.count}張
          </Text>
        </div>
        <div className='flex flex-row gap-4'>
          <Button
            type='button'
            variant='primary'
            className='w-9 h-9 rounded-full'
            onClick={() => handleCopy(item)}
          >
            複製
          </Button>
          <Button
            type='button'
            variant='primary'
            className='w-9 h-9 rounded-full'
            onClick={() => handleRemove(item.id)}
          >
            刪除
          </Button>
        </div>
      </div>

      {/* 售票時間 */}
      <div className='w-full flex flex-row gap-4 items-center'>
        <Text variant='note'>售票時間</Text>
        {item.saleTimeType ? (
          <Text variant='content'>
            {item.globalTime?.commonStartTime
              ? format(
                  parseISO(`${item.globalTime?.commonStartTime}`),
                  'yyyy/MM/dd HH:mm'
                )
              : '尚未設定'}
            {' - '}
            {item.globalTime?.commonEndTime
              ? format(
                  parseISO(`${item.globalTime?.commonEndTime}`),
                  'yyyy/MM/dd HH:mm'
                )
              : '尚未設定'}
          </Text>
        ) : (
          <Text variant='content'>
            場次開始前{item.offset.startOffset}
            {startOffsetUnit} - 場次開始前{item.offset.endOffset}
            {endOffsetUnit}
          </Text>
        )}
      </div>

      {/* 適用場次 */}
      <div className='w-full flex flex-row gap-4 rounded-md items-start relative'>
        <Text variant='note' className='min-w-fit'>
          適用場次
        </Text>
        <div
          ref={containerRef}
          className='flex gap-3 overflow-hidden relative flex-1'
        >
          {matchedSessions.map(session => {
            const startLocal = format(
              parseISO(`${session.date}T${session.startTime}`),
              'HH:mm'
            );
            const endLocal = format(
              parseISO(`${session.date}T${session.endTime}`),
              'HH:mm'
            );
            const localDate = format(
              parseISO(`${session.date}T${session.startTime}`),
              'yyyy/MM/dd'
            );

            return (
              <div
                key={session.id}
                className='session-item w-fit rounded-xs border p-2 gap-1 flex flex-col bg-white'
              >
                <Text variant='content' className='truncate'>
                  {session.name}
                </Text>
                <Text variant='note' className='text-xs'>
                  {localDate} {startLocal} - {endLocal}
                </Text>
              </div>
            );
          })}
          {hiddenCount > 0 && (
            <div className='absolute right-0 top-0 bottom-0 w-96 pointer-events-none bg-gradient-to-l from-white' />
          )}
          {hiddenCount > 0 && (
            <div className='absolute right-2 top-1/2 -translate-y-1/2 bg-gray-300 rounded px-6 py-3 '>
              <Text variant='content'>
                全部場次（{matchedSessions?.length}）
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
