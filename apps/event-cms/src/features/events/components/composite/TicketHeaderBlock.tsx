import { Button } from '@nx-playground/ui-components';
import {
  addHours,
  addMonths,
  format,
  formatISO,
  isAfter,
  parseISO,
} from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';

import { useTicketStore } from '../../stores';
import { type EventFormValue } from '../../types';
import { Text } from '../core';

export function TicketHeaderBlock() {
  const { trigger, setValue, control, getValues } =
    useFormContext<EventFormValue>();
  const hasError = useTicketStore(state => state.hasError);
  const hasTicket = useTicketStore(state => state.hasTicket);
  const sessionBlock = getValues('sessionBlock') || [];
  const { setEditingTicketId } = useTicketStore();
  const ticketBlocks = useWatch({ control, name: 'ticketBlock' });

  const handleAddTicketBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const isValid = await trigger('ticketBlock');
    if (!isValid) return;

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
        const startTime = parseISO(`${session.date}T${session.startTime}`);
        const endTime = addHours(startTime, 3); // 可調整票券開放時段長度
        return {
          sessionId: session.id,
          startTime: formatISO(startTime),
          endTime: formatISO(endTime),
        };
      }),
      saleTimeType: true,
      offset: {
        startOffset: 1,
        startOffsetBase: 1440,
        endOffset: 1,
        endOffsetBase: 1440,
      },
    };

    ticketBlocks.push(newTicket);
    setValue('ticketBlock', ticketBlocks);
    setEditingTicketId(newTicket.id);
  };

  return (
    <div className='w-full bg-background-primary items-center justify-between py-4 gap-2 flex flex-row'>
      <div className='w-fit flex flex-col gap-3'>
        <Text variant='title'>票券設定</Text>
        <Text variant='note'>建立票券類型適用場次</Text>
      </div>
      <Button
        type='button'
        variant='primary'
        onClick={handleAddTicketBlock}
        className={`${
          hasTicket ? 'flex' : 'hidden'
        } rounded-md py-2 px-8 gap-2.5`}
        disabled={hasError}
      >
        <Text variant='content' color='white'>
          + 新增票券
        </Text>
      </Button>
    </div>
  );
}
