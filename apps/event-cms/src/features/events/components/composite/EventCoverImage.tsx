import { Button, Card, CardHeader, Input } from '@nx-playground/ui-components';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { useFileUpload } from '../../hooks';
import { useEventStore } from '../../stores';
import { EditingBlockEnum } from '../../types';
import { Image, Text } from '../core/index';

export function EventsCoverImage() {
  const { setValue, getValues } = useFormContext();
  const { editingBlock, setEditingBlock } = useEventStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initFile = getValues('eventCoverImage');

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      setEditingBlock(EditingBlockEnum.CoverImage);
      fileInputRef.current.click();
    }
  };

  const {
    fileDataUrl: image,
    cleanUrl,
    handleFileChange,
  } = useFileUpload({
    initFile,
    onFileRead: file => {
      setValue('eventCoverImage', file);
    },
  });

  const handleDeleteImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValue('eventCoverImage', null);
    cleanUrl();
  };

  return (
    <Card
      className={`w-full flex flex-col items-center justify-center rounded-xl
        ${editingBlock === 0 ? ' border-2 py-4' : ''}
    `}
    >
      {/* 區塊header */}
      {editingBlock === 0 && (
        <CardHeader className='w-full px-6 py-4'>
          <Text
            variant='title'
            className='text-text-primary text-bold text-2xl text-start w-full'
          >
            活動封面
          </Text>
        </CardHeader>
      )}

      <div
        className={`flex w-full h-fit max-h-[600px] relative overflow-hidden group ${
          editingBlock === 0 ? 'px-6 py-4' : ''
        }`}
      >
        {/* 如果沒有圖片的話 會顯示chekcer跟上傳按鈕 */}
        {image === null ? (
          <>
            <Image alt='Event Cover' className='w-full h-auto rounded-xl' />
            <div className='absolute w-full h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col gap-y-4 '>
              <Input
                type='file'
                name='EventCoverImage'
                ref={fileInputRef}
                accept='image/jpeg,image/png,image/heic'
                className='hidden'
                onChange={handleFileChange}
              />
              <Button
                type='button'
                variant='outline'
                className='px-4 py-2 bg-white gap-[10px]'
                onClick={handleButtonClick}
              >
                <div className='w-5 h-5 rounded-full bg-green-500 inline-block' />
                <Text variant='content' color='black'>
                  上傳活動封面
                </Text>
              </Button>
              <Text
                variant='note'
                className={`w-full h-auto text-center ${
                  editingBlock === 0 && 'px-6'
                }`}
              >
                支援JPG、PNG、HEIC
                格式，檔案大小不超過8MB，建議尺寸：1200x600像素
              </Text>
            </div>
          </>
        ) : editingBlock === 0 ? (
          // 如果有圖片 並且在編輯狀態 會有hover的按鈕
          <>
            <Image
              src={image}
              alt='Event Cover'
              className='w-full h-auto rounded-xl'
              onClick={() => {
                setEditingBlock(EditingBlockEnum.CoverImage);
              }}
            />
            <div className='absolute w-full h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden items-center justify-center flex-row gap-6 group-hover:flex'>
              <Input
                type='file'
                name='EventCoverImage'
                accept='image/jpeg,image/png,image/heic'
                ref={fileInputRef}
                className='hidden'
                onChange={handleFileChange}
              />
              <Button
                type='button'
                variant='outline'
                className='px-4 py-2 bg-white gap-[10px]'
                onClick={handleButtonClick}
              >
                <div className='w-5 h-5 rounded-full bg-green-500 inline-block' />
                <Text variant='content' className='text-black'>
                  更換圖片
                </Text>
              </Button>
              <Button
                type='button'
                variant='outline'
                className='px-4 py-2 bg-white gap-[10px]'
                onClick={handleDeleteImage}
              >
                <div className='w-5 h-5 rounded-full bg-red-500 inline-block' />
                <Text variant='content' color='black'>
                  刪除圖片
                </Text>
              </Button>
            </div>
          </>
        ) : (
          // 如果有圖片 但在預覽狀態 就只會展現圖片，被點擊時會進入編輯狀態
          <Image
            src={image}
            alt='Event Cover'
            className='w-full h-auto rounded-xl cursor-pointer'
            onClick={() => {
              setEditingBlock(EditingBlockEnum.CoverImage);
            }}
          />
        )}
      </div>
    </Card>
  );
}
