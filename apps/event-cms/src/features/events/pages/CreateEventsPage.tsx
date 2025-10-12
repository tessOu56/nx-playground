import { zodResolver } from '@hookform/resolvers/zod';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormProvider, useForm } from 'react-hook-form';

import {
  EventContent,
  EventCreateBottombar,
  EventCreateSidebar,
  EventCreateTopbar,
  EventIntroduction,
  EventsCoverImage,
  FAQ,
  FormEditBlock,
  FormHeaderBlock,
  FormMainBlock,
  PaymentBlock,
  PreviewSideBar,
  SessionEditBlock,
  SessionHeaderBlock,
  SessionMainBlock,
  TicketEditBlock,
  TicketHeaderBlock,
  TicketMainBlock,
  VisibilityBlock,
} from '../components';
import { FormModal } from '../components/composite/FormModal';
import { type EventFormValue, eventFormSchema } from '../types';
import {
  useFormStore,
  useNavigateStore,
  usePreviewStore,
} from '../useEventStore';

export function CreateEventsPage() {
  const { navigate } = useNavigateStore();
  const formSaveTemplate = useFormStore(state => state.openSaveTemplate);
  const formApplyTemplate = useFormStore(state => state.openApplyTemplate);
  const {
    setEditingPaymentType,
    setOpenPreferAccount,
    setEditingDescriptionType,
    setHasError,
  } = usePreviewStore();
  const methods = useForm<EventFormValue>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    defaultValues: {
      eventCoverImage: null,
      eventName: 'i am title ',
      eventDescription: 'i am descripttion',
      eventLocation: 'i am location',
      eventContentBlocks: [
        {
          id: '123',
          type: 'text',
          content: 'content',
        },
      ],
      faqBlocks: [
        {
          id: '123',
          question: 'i am question',
          answer: 'i am answer',
        },
      ],
      sessionBlock: [
        {
          id: 'session_001',
          name: '台北場早場',
          date: '2025-01-01',
          startTime: '08:00:00+08:00',
          endTime: '23:00:00+08:00',
          capacityLimit: 10,
        },
        {
          id: 'session_002',
          name: '台北場晚場',
          date: '2025-12-31',
          startTime: '12:00:00+08:00',
          endTime: '20:00:00+08:00',
          capacityLimit: 10,
        },
      ],
      ticketBlock: [
        {
          id: 't-1',
          name: 'name',
          count: 50,
          price: 200,
          saleTime: [
            {
              sessionId: 'session_001',
              startTime: '2025-02-20T08:00:00+08:00',
              endTime: '2025-02-21T08:00:00+08:00',
            },
          ],
          saleTimeType: true,
          state: true,
          offset: {
            startOffset: 1,
            startOffsetBase: 1440,
            endOffset: 1,
            endOffsetBase: 1440,
          },
          globalTime: {
            commonEndTime: '2025-02-21T08:00:00+08:00',
            commonStartTime: '2025-02-20T08:00:00+08:00',
          },
        },
      ],
      // ticketBlock: [],
      bankTransfer: {
        id: '',
        enable: false,
        type: 'ATM',
        bankName: '',
        branchName: '',
        accountName: '',
        account: '',
        description: '',
      },
      visibility: 'public',
    },
  });
  const { getValues } = methods;

  const handleBlockClick = async (type: string) => {
    switch (type) {
      case 'Preview':
        {
          const isBankEnable = getValues('bankTransfer.enable');
          setEditingDescriptionType('null');
          if (isBankEnable) {
            const isValid = await methods.trigger([
              'bankTransfer.bankName',
              'bankTransfer.branchName',
              'bankTransfer.accountName',
              'bankTransfer.account',
            ]);
            if (!isValid) {
              setHasError(true);
              setEditingPaymentType('bankTransfer.info');
            } else setEditingPaymentType('null');
            return;
          }
        }
        break;

      default:
        break;
    }
  };

  return (
    <FormProvider {...methods}>
      <form className='w-full h-full'>
        <div className='w-full h-full '>
          <EventCreateTopbar handleSaveEvent={() => console.log('saving...')} />

          <div className='flex'>
            {/* sidebar - tab */}
            <EventCreateSidebar />

            {/* 基本資訊 */}
            {navigate === 0 && (
              <div className='flex flex-1 justify-center items-start py-6 px-8'>
                <div className='flex flex-col gap-y-4 w-full lg:max-w-[1178px] pb-24'>
                  <EventsCoverImage />
                  <EventIntroduction />
                  <DndProvider backend={HTML5Backend}>
                    <EventContent />
                    <FAQ />
                  </DndProvider>
                </div>
              </div>
            )}

            {/* 場次管理 */}
            {navigate === 1 && (
              <div className='w-full flex flex-row pb-24 justify-between'>
                <div className='w-full flex flex-col gap-4 px-8 pt-6'>
                  {/* 把 append 傳下去 */}
                  <SessionHeaderBlock />
                  <SessionMainBlock />
                </div>
                <SessionEditBlock />
              </div>
            )}

            {/* 票券管理 */}
            {navigate === 2 && (
              <div className='w-full flex flex-row pb-24 relative justify-between'>
                <div className='w-full flex flex-col gap-4 px-8 pt-6'>
                  <TicketHeaderBlock />
                  <TicketMainBlock />
                </div>
                <TicketEditBlock />
              </div>
            )}

            {/* 表單設計 */}
            {navigate === 3 && (
              <DndProvider backend={HTML5Backend}>
                <div className='w-full flex flex-row pb-24 relative justify-between'>
                  <div className='w-full flex flex-col gap-4 px-8 pt-6 max-w-[900px]'>
                    <FormHeaderBlock />
                    <FormMainBlock />
                  </div>
                  <FormEditBlock />
                </div>
              </DndProvider>
            )}

            {/* 檢視發布 */}
            {navigate === 4 && (
              <div
                className='flex flex-row w-full h-full pb-24 justify-between'
                onClick={() => handleBlockClick('Preview')}
              >
                <div
                  className='flex flex-col w-full max-w-[900px] px-8 py-6 gap-4'
                  onClick={() => setOpenPreferAccount(false)}
                >
                  <PaymentBlock />
                  <VisibilityBlock />
                </div>
                <PreviewSideBar />
              </div>
            )}
          </div>
          <EventCreateBottombar />
        </div>
        {(formApplyTemplate || formSaveTemplate) && (
          <div className='w-full h-full'>
            <FormModal />
          </div>
        )}
      </form>
    </FormProvider>
  );
}
