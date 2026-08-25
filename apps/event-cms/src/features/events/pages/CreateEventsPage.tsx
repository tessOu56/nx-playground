import { useState } from 'react';
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
  PublishSuccessBanner,
  SessionEditBlock,
  SessionHeaderBlock,
  SessionMainBlock,
  TicketEditBlock,
  TicketHeaderBlock,
  TicketMainBlock,
  VisibilityBlock,
  type PublishSuccess,
} from '../components';
import { FormModal } from '../components/composite/FormModal';
import { emptyEventFormDefaults } from '../constants/emptyEventFormDefaults';
import { useEventCreateController } from '../controllers';
import {
  useFormStore,
  useNavigateStore,
  usePreviewStore,
} from '../stores';
import { type EventFormValue, eventFormSchema } from '../types';

export function CreateEventsPage() {
  const { handleSubmit: persistEvent } = useEventCreateController();
  const { navigate } = useNavigateStore();
  const [published, setPublished] = useState<PublishSuccess | null>(null);
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
    defaultValues: emptyEventFormDefaults,
  });
  const { getValues, reset } = methods;

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
          <EventCreateTopbar
            handleSaveEvent={() => {
              void (async () => {
                const result = await persistEvent(getValues());
                if (!result) return;
                setPublished({
                  eventId: result.eventId,
                  previewUrl: result.previewUrl,
                  title: result.title,
                });
                reset(emptyEventFormDefaults);
              })();
            }}
          />
          {published ? (
            <PublishSuccessBanner
              published={published}
              onDismiss={() => setPublished(null)}
            />
          ) : null}

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
