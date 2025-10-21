import { Button, Textarea } from '@nx-playground/ui-components';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Controller, useFormContext } from 'react-hook-form';

import { useEventStore } from '../../stores';
import { Text } from '../core/index';
import { TextBlockToolbar } from '../index';

type Props = {
  index: number;
  remove: () => void;
  moveBlock: (from: number, to: number) => void;
};

const ItemTypes = { BLOCK: 'block' };

export function TextBlock({ index, remove, moveBlock }: Props) {
  const { control } = useFormContext();
  const { editingBlock } = useEventStore();

  // dnd相關
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragButtonRef = useRef<HTMLButtonElement>(null);
  // 放置 hook
  const [, drop] = useDrop({
    accept: ItemTypes.BLOCK,
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
    type: ItemTypes.BLOCK,
    item: { index },
  });

  // 按鈕觸發 drag，整個區塊作為 drag preview
  if (dragButtonRef.current) drag(dragButtonRef.current);
  if (ref.current) preview(ref.current);

  return editingBlock === 2 ? (
    <div
      ref={ref}
      className={`w-full group flex flex-col-reverse lg:flex-row items-center justify-start p-4 gap-6 rounded-xl hover:border border-1 relative ${
        isHovered ? 'bg-gray-200' : ''
      }`}
    >
      <div className='flex lg:max-w-[952px] w-full h-auto h-min-[248px] rounded-[8px] border border-1 flex-col'>
        <TextBlockToolbar />
        <Controller
          name={`eventContentBlocks.${index}.content`}
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder='輸入文字'
              {...field}
              className='text-black rounded-t-none min-h-44 h-auto focus:outline-none focus:shadow-none'
            />
          )}
        />
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
          className='w-[40px] h-[40px] rounded-full flex items-center justify-center gap-1'
          variant='primary'
          ref={dragButtonRef}
        >
          <Text variant='content' className='text-center' color='white'>
            拖曳
          </Text>
        </Button>
      </div>
    </div>
  ) : (
    <div className='w-full py-4 px-6 gap-2.5'>
      <Controller
        name={`eventContentBlocks.${index}.content`}
        control={control}
        render={({ field }) => <span>{field.value}</span>}
      />
    </div>
  );
}
