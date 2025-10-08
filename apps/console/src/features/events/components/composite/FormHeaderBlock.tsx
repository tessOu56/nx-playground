import { Button } from '@nx-playground/ui-components';
import { useFormContext } from 'react-hook-form';

import { type EventFormValue } from '../../types';
import { useFormStore } from '../../useEventStore';
import { Text } from '../core';

export function FormHeaderBlock() {
  const hasForm = useFormStore(state => state.hasForm);
  const template = useFormStore(state => state.template);
  const { setOpenApplyTemplate, setOpenSaveTemplate } = useFormStore();
  const { trigger } = useFormContext<EventFormValue>();

  const OnClickSaveTemplate = async () => {
    if (template.length >= 3) return;
    const isValid = await trigger('formBlock');
    if (!isValid) return;
    setOpenSaveTemplate(true);
  };
  const OnClickApplyTemplate = () => {
    setOpenApplyTemplate(true);
  };

  return (
    <div className='w-full flex flex-row py-4 justify-between'>
      <div className='gap-3 flex flex-col'>
        <Text variant='title'>設計表單</Text>
        <Text variant='content'>設計報名表單，或套用表單模板。</Text>
      </div>
      {hasForm && (
        <div className='flex flex-row gap-3'>
          {template.length >= 0 && (
            <Button
              variant='primary'
              type='button'
              className='gap-2.5 py-2 px-8 rounded-md border h-fit w-fit'
              onClick={OnClickApplyTemplate}
            >
              <Text variant='content' color='white'>
                套用模板
              </Text>
            </Button>
          )}
          <Button
            variant={`${template.length >= 3 ? 'outline' : 'primary'}`}
            type='button'
            className='gap-2.5 py-2 px-8 rounded-md border h-fit w-fit'
            onClick={OnClickSaveTemplate}
          >
            <Text
              variant='content'
              color={`${template.length >= 3 ? '' : 'white'}`}
            >
              儲存為模板
            </Text>
          </Button>
        </div>
      )}
    </div>
  );
}
