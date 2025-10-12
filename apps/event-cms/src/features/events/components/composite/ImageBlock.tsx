import { Button, Input } from '@nx-playground/ui-components';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useFormContext } from 'react-hook-form';

import { useFileUpload } from '../../hooks';
import { useEventStore } from '../../useEventStore';
import { Image, Text } from '../core/index';

type Props = {
  index: number;
  remove: () => void;
  moveBlock: (from: number, to: number) => void;
};

const ItemTypes = { BLOCK: 'block' };

export function ImageBlock({ index, remove, moveBlock }: Props) {
  const { setValue, getValues } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  // 上傳圖片
  const initFile = getValues(`eventContentBlocks.${index}.content`);
  const { fileDataUrl: image, handleFileChange } = useFileUpload({
    initFile,
    onFileRead: file => setValue(`eventContentBlocks.${index}.content`, file),
  });
  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return editingBlock === 2 ? (
    <div
      ref={ref}
      className={`w-full group flex items-center justify-start p-4 gap-6 rounded-xl hover:border border-1 relative ${
        isHovered ? 'bg-gray-200' : ''
      }`}
    >
      <div className='flex lg:max-w-[952px] lg:max-h-[352px] w-full relative rounded-xl overflow-hidden'>
        <Image
          src={image}
          alt=''
          className={`w-full ${image ? 'opacity-100' : 'opacity-20'}`}
        />

        <div
          className={`absolute w-fit h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-[16px] ${
            image ? 'hidden group-hover:flex' : 'flex'
          }`}
        >
          <Input
            type='file'
            ref={fileInputRef}
            accept='image/jpeg,image/png,image/heic'
            className='hidden'
            onChange={handleFileChange}
          />
          <Button
            type='button'
            variant='outline'
            className='px-8 py-2 bg-white  gap-2.5'
            onClick={handleButtonClick}
          >
            <div className='w-5 h-5 rounded-full bg-green-500 inline-block' />
            <Text variant='content' color='black'>
              {image ? '更換照片' : '上傳照片'}
            </Text>
          </Button>
          {!image && (
            <Text variant='note'>
              支援JPG、PNG、HEIC 格式，檔案大小不超過8MB
            </Text>
          )}
        </div>
      </div>

      <div className='flex flex-row gap-6 absolute top-3 right-3 lg:relative lg:opacity-0 lg:group-hover:opacity-100'>
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
      <Image
        src={image}
        alt=''
        className={`w-full ${image ? 'opacity-100' : 'opacity-20'}`}
      />
    </div>
  );
}
