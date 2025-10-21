import { Button } from '@nx-playground/ui-components';
import { addMonths, format, formatISO, isAfter, parseISO } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';

import { useTicketStore } from '../../stores';
import { type EventFormValue, type TicketBlockType } from '../../types';
import { Text } from '../core';

import { TicketBlock } from './TicketBlock';

export function TicketMainBlock() {
  const { control, setValue, getValues } = useFormContext<EventFormValue>();
  const ticketBlock = useWatch({ control, name: 'ticketBlock' }) || [];
  const { setHasTicket, setEditingTicketId } = useTicketStore();
  const hasError = useTicketStore(state => state.hasError);
  const sessionBlock = getValues('sessionBlock') || [];

  const handleAddTicketBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowDate = new Date();

    const filterSession = sessionBlock.filter(session => {
      if (!session.date || !session.startTime) return false;
      const sessionStart = parseISO(`${session.date}T${session.startTime}`);
      return isAfter(sessionStart, nowDate);
    });

    const newTicket = {
      id: Date.now().toString(),
      name: '一般票',
      price: 200,
      count: 50,
      state: true,
      globalTime: {
        commonEndTime: format(
          addMonths(new Date().setMinutes(0, 0, 0), 1),
          "yyyy-MM-dd'T'HH:mm:ssxxx"
        ),
        commonStartTime: format(
          new Date().setMinutes(0, 0, 0),
          "yyyy-MM-dd'T'HH:mm:ssxxx"
        ),
      },
      saleTime: filterSession.map(session => {
        const defaultTime = parseISO(`${session.date}T${session.startTime}`);
        const startTime = addMonths(defaultTime, -1);
        return {
          sessionId: session.id,
          startTime: formatISO(startTime),
          endTime: formatISO(defaultTime),
        };
      }),
      saleTimeType: false,
      offset: {
        startOffset: 1,
        startOffsetBase: 1440,
        endOffset: 1,
        endOffsetBase: 1440,
      },
    };

    setValue('ticketBlock', [...ticketBlock, newTicket], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setHasTicket(true);
    setEditingTicketId(newTicket.id);
  };

  const handleClickOutside = () => {
    if (hasError) return;
    setEditingTicketId(null);
  };

  return (
    <div
      className='flex-1 flex flex-col items-center w-full'
      onClick={handleClickOutside}
    >
      {ticketBlock.length === 0 ? (
        <div className='gap-10 flex flex-col items-center'>
          <p>目前還沒有任何票券，來建立第一張票券吧！</p>
          <Button
            type='button'
            variant='primary'
            onClick={handleAddTicketBlock}
            disabled={hasError}
          >
            <Text variant='content' color='white'>
              + 新增票券
            </Text>
          </Button>
        </div>
      ) : (
        <div className='w-full flex flex-col gap-4 justify-start items-center'>
          <Text variant='content' className='w-full text-end'>
            全部票券（{ticketBlock.length}）
          </Text>
          {ticketBlock.map((item: TicketBlockType) => (
            <TicketBlock
              key={item.id}
              item={item}
              sessionBlock={sessionBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
