import { Button, Card } from '@nx-playground/ui-components';
import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { EditingBlockEnum, type EventFormValue } from '../../types';
import { useEventStore } from '../../useEventStore';
import { Text } from '../core';

import { QuestionBlock } from './QuestionBlock';

export function FAQ() {
  const { control, getValues, setValue } = useFormContext<EventFormValue>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faqBlocks',
  });
  const { editingBlock, setEditingBlock } = useEventStore();
  const faqBlock = useWatch({ control, name: 'faqBlocks' }) ?? [];

  // DnD 相關
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'faq', // 這裡定義拖拽類型
  });
  drop(ref);

  // 移動區塊
  const moveBlock = (from: number, to: number) => {
    const old = [...faqBlock];
    const [removed] = old.splice(from, 1);
    old.splice(to, 0, removed);
    setValue('faqBlocks', old);
  };

  // 新增 FAQ 區塊
  const handleAddFAQ = (e: React.MouseEvent) => {
    e.stopPropagation();
    append({ id: Date.now().toString(), question: '', answer: '' });
  };

  // 過濾空白 FAQ
  useEffect(() => {
    if (editingBlock !== EditingBlockEnum.FAQ) {
      const currentFaqs = getValues('faqBlocks');
      const filteredFaqs = currentFaqs?.filter(
        faq => faq.question.trim() !== '' || faq.answer.trim() !== ''
      );
      setValue('faqBlocks', filteredFaqs);
    }
  }, [editingBlock, getValues, setValue]);

  return (
    <Card
      ref={ref}
      className='flex py-[32px] px-[24px] flex-col items-center justify-center border-2 border-dashed rounded-xl gap-y-[16px] cursor-pointer'
      onClick={() => setEditingBlock(EditingBlockEnum.FAQ)}
    >
      <Text variant='title' className='text-start w-full'>
        常見問題
      </Text>

      {editingBlock === EditingBlockEnum.FAQ ? (
        <>
          {fields.map((field, index) => (
            <QuestionBlock
              key={field.id}
              index={index}
              remove={() => remove(index)}
              moveBlock={moveBlock}
            />
          ))}

          <div className='w-full p-4 gap-10 flex items-center justify-center'>
            <Button
              variant='primary'
              type='button'
              className='border border-border-primary px-8 py-1 rounded-md'
              onClick={handleAddFAQ}
            >
              <Text variant='content' color='white'>
                + 新增問答區塊
              </Text>
            </Button>
          </div>
        </>
      ) : fields.length > 0 ? (
        fields.map((field, index) => (
          <div className='w-full flex flex-col py-4 px-6' key={field.id}>
            <Text variant='title' className='w-full px-3 py-4 gap-2.5 block'>
              Q. {getValues(`faqBlocks.${index}.question`)}
            </Text>
            <Text variant='content' className='w-full px-7 py-4 gap-2.5 block'>
              A. {getValues(`faqBlocks.${index}.answer`)}
            </Text>
          </div>
        ))
      ) : (
        <Text variant='note' className='text-start w-full '>
          建議您詳細說明...
        </Text>
      )}
    </Card>
  );
}
