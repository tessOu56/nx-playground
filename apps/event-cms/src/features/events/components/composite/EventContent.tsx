import { Button } from '@nx-playground/ui-components';
import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useEventStore } from '../../stores';
import { EditingBlockEnum, type EventFormValue } from '../../types';
import { Text } from '../core/index';
import { ImageBlock, TextBlock } from '../index';

export function EventContent() {
  const { control, getValues, setValue } = useFormContext<EventFormValue>();
  const { editingBlock, setEditingBlock } = useEventStore();
  const eventContentBlock =
    useWatch({ control, name: 'eventContentBlocks' }) ?? [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'eventContentBlocks',
  });

  // dnd相關
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'block',
  });
  drop(ref);

  // 移動區塊
  const moveBlock = (from: number, to: number) => {
    const old = [...eventContentBlock];
    const [removed] = old.splice(from, 1);
    old.splice(to, 0, removed);
    setValue('eventContentBlocks', old);
  };

  // 新增文字區塊
  const handleAddTextBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    append({ id: Date.now().toString(), type: 'text', content: '' });
  };

  // 新增圖片區塊
  const handleAddImageBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    append({ id: Date.now().toString(), type: 'image', content: null });
  };

  // 過濾空白區塊
  useEffect(() => {
    if (editingBlock !== EditingBlockEnum.EventContent) {
      const currentBlocks = getValues('eventContentBlocks');
      const filteredBlocks = currentBlocks?.filter(block => {
        if (typeof block.content === 'string') {
          return block.content?.trim() !== '';
        }
        if (block.type === 'image') {
          return block.content !== null;
        }
        return true;
      });
      setValue('eventContentBlocks', filteredBlocks);
    }
  }, [editingBlock, getValues, setValue]);

  return (
    <div
      className='flex py-[32px] px-[24px] flex-col items-center justify-center border-2 border-dashed rounded-xl gap-[16px] cursor-pointer'
      onClick={() => setEditingBlock(EditingBlockEnum.EventContent)}
      ref={ref}
    >
      <Text variant='title' className='text-start w-full'>
        活動內容
      </Text>
      <Text variant='note' className='text-start w-full'>
        建議您詳細說明活動內容，包含活動流程、地點資訊、參加方式及注意事項等，幫助參加者了解活動詳情、做好準備，也提升活動被搜尋與分享的機會。
      </Text>

      {/* 渲染區塊 */}
      {fields.map((item, index) => {
        if (item.type === 'text') {
          return (
            <TextBlock
              key={item.id}
              index={index}
              remove={() => remove(index)}
              moveBlock={moveBlock}
            />
          );
        }
        if (item.type === 'image') {
          return (
            <ImageBlock
              key={item.id}
              index={index}
              remove={() => remove(index)}
              moveBlock={moveBlock}
            />
          );
        }
        return null;
      })}

      {/* 新增按鈕 */}
      {editingBlock === EditingBlockEnum.EventContent && (
        <div className='flex items-center justify-center gap-x-[40px]'>
          <Button
            type='button'
            className='border border-black px-[32px] py-[4px] rounded-[8px]'
            variant='primary'
            onClick={handleAddTextBlock}
          >
            <Text variant='content' color='white'>
              + 新增文字區塊
            </Text>
          </Button>
          <Button
            type='button'
            className='border border-black px-[32px] py-[4px] rounded-[8px]'
            variant='primary'
            onClick={handleAddImageBlock}
          >
            <Text variant='content' color='white'>
              + 新增圖片區塊
            </Text>
          </Button>
        </div>
      )}
    </div>
  );
}
