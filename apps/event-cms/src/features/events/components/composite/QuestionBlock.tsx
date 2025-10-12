import { Button, Input, Textarea } from '@nx-playground/ui-components';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Controller, useFormContext } from 'react-hook-form';

import { Text } from '../core';

const ItemTypes = { FAQ: 'faq' };

type Props = {
  index: number;
  remove: () => void;
  moveBlock: (from: number, to: number) => void;
};

export function QuestionBlock({ index, remove, moveBlock }: Props) {
  const { control } = useFormContext();
  const ref = useRef<HTMLDivElement>(null);
  const dragButtonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 放置 hook
  const [, drop] = useDrop({
    accept: ItemTypes.FAQ,
    hover: (item: { index: number }) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: monitor => setIsHovered(monitor.isOver()),
  });

  drop(ref);

  // 拖曳 hook，只在按鈕觸發
  const [, drag, preview] = useDrag({
    type: ItemTypes.FAQ,
    item: { index },
  });

  // 按鈕觸發 drag，整個區塊作為 drag preview
  if (dragButtonRef.current) drag(dragButtonRef.current);
  if (ref.current) preview(ref.current);

  return (
    <div
      ref={ref}
      className={`w-full group border-border-primary border flex flex-col-reverse lg:flex-row items-center rounded-lg p-4 gap-6 ${
        isHovered ? 'bg-gray-200' : ''
      }`}
    >
      <div className='w-full max-w-[952px] gap-6 flex flex-col'>
        <div className='w-full gap-2 flex flex-col'>
          <Text variant='content'>問題</Text>
          <Controller
            name={`faqBlocks.${index}.question`}
            control={control}
            rules={{ required: '請輸入問題' }}
            render={({ field }) => <Input {...field} type='text' />}
          />
        </div>
        <div className='w-full gap-2 flex flex-col'>
          <Text variant='content'>答案</Text>
          <Controller
            name={`faqBlocks.${index}.answer`}
            control={control}
            rules={{ required: '請輸入答案' }}
            render={({ field }) => <Textarea {...field} className='min-h-40' />}
          />
        </div>
      </div>

      <div className='opacity-0 flex flex-row gap-6 group-hover:opacity-100'>
        <Button
          type='button'
          className='w-[40px] h-[40px] rounded-full flex items-center justify-center gap-1'
          variant='primary'
          onClick={remove}
        >
          <Text variant='content' className='text-center' color='white'>
            刪除
          </Text>
        </Button>
        <Button
          type='button'
          className='w-[40px] h-[40px] rounded-full flex items-center justify-center gap-1 cursor-grab'
          variant='primary'
          ref={dragButtonRef}
        >
          <Text variant='content' className='text-center' color='white'>
            拖曳
          </Text>
        </Button>
      </div>
    </div>
  );
}
