import { Button, useToast } from '@nx-playground/ui-components';
import { type SubmitHandler, useFormContext } from 'react-hook-form';

import {
  useEventStore,
  useNavigateStore,
  useSessionStore,
} from '../../stores';
import {
  EditingBlockEnum,
  type EventFormValue,
  NavigateEnum,
  type TicketBlockType,
} from '../../types';
import { calculateOffsetSaleTime } from '../../utils/ticketoffsetCalculate';
import { Text } from '../core';

export function EventCreateBottombar() {
  const { getValues, trigger, setValue } = useFormContext<EventFormValue>();
  const { setEditingBlock } = useEventStore();
  const { navigate, setNavigate } = useNavigateStore();
  const { setHasError } = useSessionStore();
  const { addToast } = useToast();

  const onSubmit: SubmitHandler<EventFormValue> = data => {
    switch (navigate) {
      case 0:
        break;
      case 1:
        break;
      case 2: {
        const tickets = getValues('ticketBlock');
        const session = getValues('sessionBlock');
        const newTickets = tickets.map(ticket => {
          if (ticket.saleTimeType) {
            if (!ticket.globalTime) return ticket;

            const { commonStartTime, commonEndTime } = ticket.globalTime;

            const newSaleTime = ticket.saleTime.map(saleTime => ({
              sessionId: saleTime.sessionId,
              startTime: commonStartTime,
              endTime: commonEndTime,
            }));
            return {
              ...ticket,
              saleTime: newSaleTime,
            };
          } else {
            const commonOffset = ticket.offset;
            const newSaleTime = ticket.saleTime.map(saleTime => {
              const StartOffsetResult = calculateOffsetSaleTime({
                sessionBlock: session,
                item: saleTime,
                type: 'start', // 或 'end' 看需求
                offset: commonOffset.startOffset,
                offsetBase: commonOffset.startOffsetBase || 1440,
              });
              const EndOffsetResult = calculateOffsetSaleTime({
                sessionBlock: session,
                item: saleTime,
                type: 'end', // 或 'end' 看需求
                offset: commonOffset.endOffset,
                offsetBase: commonOffset.endOffsetBase || 1440,
              });

              return {
                sessionId: saleTime.sessionId, // 保留 sessionId
                startTime: StartOffsetResult.startTime,
                endTime: EndOffsetResult.endTime,
              };
            });

            return {
              ...ticket,
              saleTime: newSaleTime,
            };
          }
        });
        setValue('ticketBlock', newTickets);
        break;
      }
      case 3:
        break;
      case 4:
        console.log('data,', data.bankTransfer);
        console.log('data,', data.cashpayment);
        break;
      default:
        break;
    }
  };

  const handleClickNext = async () => {
    switch (navigate) {
      case 0: {
        const eventName = getValues('eventName');
        if (!eventName || eventName.trim() === '') {
          setEditingBlock(EditingBlockEnum.Introduction);
          return;
        }
        onSubmit(getValues());
        setNavigate(NavigateEnum.session);
        break;
      }
      case 1: {
        const sessionBlock = getValues('sessionBlock');

        // 沒有新增場次
        if (!sessionBlock || sessionBlock.length === 0) {
          addToast({ message: '請新增場次', type: 'error' });
          return;
        }

        // 驗證整個 sessionBlock 每個必填欄位
        const isValid = await trigger('sessionBlock');
        setHasError(!isValid);
        if (!isValid) {
          addToast({ message: '請確認場次資訊有沒有正確輸入', type: 'error' });
          return;
        }

        onSubmit(getValues());
        setNavigate(NavigateEnum.ticket);
        break;
      }
      case 2: {
        const ticketBlock = getValues('ticketBlock');

        // 沒有新增場次
        if (!ticketBlock || ticketBlock.length === 0) {
          addToast({ message: '請新增票券', type: 'error' });

          return;
        }

        // 驗證整個 sessionBlock 每個必填欄位
        const isValid = await trigger('ticketBlock');
        setHasError(!isValid);
        if (!isValid) {
          addToast({ message: '請確認票券資訊有沒有正確輸入', type: 'error' });
          return;
        }
        let isAllNoAvailable = true;
        ticketBlock.map((item: TicketBlockType) => {
          if (item?.state === true) isAllNoAvailable = false;
          return;
        });
        if (isAllNoAvailable) {
          addToast({ message: '請至少一個票券是發售狀態', type: 'error' });
          return;
        }
        onSubmit(getValues());
        setNavigate(NavigateEnum.form);
        break;
      }
      case 3: {
        const isValid = await trigger('formBlock');
        if (!isValid) {
          addToast({ message: '請確認欄位資訊有沒有正確輸入', type: 'error' });
          return;
        }
        onSubmit(getValues());
        setNavigate(NavigateEnum.preView);
        break;
      }
      case 4: {
        const isbankValid = await trigger('bankTransfer');
        setHasError(!isbankValid);
        if (!isbankValid) {
          addToast({
            message: '請確認銀行匯款資訊是否有正確輸入',
            type: 'error',
          });
          return;
        }
        onSubmit(getValues());
        setNavigate(NavigateEnum.event);
        break;
      }

      default:
        break;
    }
  };

  const handleClickPrev = () => {
    switch (navigate) {
      case 0:
        break;
      case 1:
        setNavigate(NavigateEnum.event);
        break;
      case 2:
        setNavigate(NavigateEnum.session);
        break;
      case 3:
        setNavigate(NavigateEnum.ticket);
        break;
      case 4:
        setNavigate(NavigateEnum.form);
        break;
      default:
        break;
    }
  };

  return (
    <div className='fixed bottom-0 left-0 w-full bg-background-primary border-t border-1 py-4 px-6 flex items-center justify-end z-50 gap-10'>
      {navigate > 0 && (
        <Button
          variant='primary'
          type='button'
          className='rounded-md border px-12 py-3 gap-2.5 border-border-primary'
          onClick={handleClickPrev}
        >
          <Text variant='content' color='white'>
            上一步
          </Text>
        </Button>
      )}
      <Button
        variant='primary'
        type='button'
        className='rounded-md border px-12 py-3 gap-2.5 border-border-primary'
        onClick={handleClickNext}
      >
        <Text variant='content' color='white'>
          下一步
        </Text>
      </Button>
    </div>
  );
}
