import { Button, Input, Textarea } from '@nx-playground/ui-components';
import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useFormStore } from '../../stores';
import { type EventFormFieldType as FormFieldType } from '../../types';
import { Text } from '../core';

const ItemTypes = { BOX: 'box' };

interface DropBoxProps {
  field: FormFieldType;
  index: number;
  moveField: (from: number, to: number) => void;
  deleteField: (e: React.MouseEvent, id: string) => void;
}

export const FormDNDBlock: React.FC<DropBoxProps> = ({
  field,
  index,
  moveField,
  deleteField,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragButtonRef = useRef<HTMLButtonElement>(null);
  const { setEditingFormId, setToggleAreaIndex } = useFormStore();
  const hasError = useFormStore(state => state.hasError);

  // 放置 hook
  const [, drop] = useDrop({
    accept: ItemTypes.BOX,
    hover: (item: { index: number }) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: monitor => setIsHovered(monitor.isOver()),
  });

  drop(ref);

  // 拖曳 hook，只在按鈕觸發
  const [, drag, preview] = useDrag({
    type: ItemTypes.BOX,
    item: { index },
  });

  // 按鈕觸發 drag，整個區塊作為 drag preview
  if (dragButtonRef.current) drag(dragButtonRef.current);
  if (ref.current) preview(ref.current);

  const dndBlockOnClick = () => {
    if (hasError) return;
    setEditingFormId(field.id);
  };

  return (
    <div
      ref={ref}
      className={`w-full max-w-[804px] h-fit p-4 gap-2.5 ${
        isHovered ? 'bg-gray-300' : 'bg-background-primary'
      } cursor-default rounded-md flex flex-row items-center border border-black border-opacity-0 hover:border-opacity-100 group`}
      onClick={dndBlockOnClick}
    >
      <div className='flex flex-col flex-1 gap-2.5'>
        <Text variant='content' className='w-full font-bold'>
          {field.label}
          {field.isRequired ? '*' : ''}
        </Text>
        {(() => {
          switch (field.fieldType) {
            case 'text':
              return (
                <Input
                  placeholder={field.hint}
                  disabled
                  style={{ pointerEvents: 'none' }}
                />
              );
            case 'email':
              return (
                <Input
                  type='email'
                  placeholder={field.hint}
                  disabled
                  style={{ pointerEvents: 'none' }}
                />
              );
            case 'number':
              return (
                <Input
                  type='number'
                  placeholder={field.hint}
                  disabled
                  style={{ pointerEvents: 'none' }}
                />
              );
            case 'tel':
              return (
                <Input
                  type='tel'
                  placeholder={field.hint}
                  disabled
                  style={{ pointerEvents: 'none' }}
                />
              );
            case 'url':
              return (
                <Input
                  type='url'
                  placeholder={field.hint}
                  disabled
                  style={{ pointerEvents: 'none' }}
                />
              );
            case 'textarea':
              return (
                <Textarea
                  placeholder={field.hint}
                  disabled
                  style={{ height: 'auto', pointerEvents: 'none' }}
                  rows={4}
                />
              );
            case 'date':
              return (
                <Input
                  type='date'
                  placeholder={field.hint}
                  disabled
                  style={{ pointerEvents: 'none' }}
                />
              );
            case 'radio':
              return field.options?.length ? (
                <div className='flex flex-col gap-2'>
                  {field.options.map((opt, i) => (
                    <div
                      key={`radio-option-${i}`}
                      className='flex items-center gap-2'
                    >
                      <Input
                        type='radio'
                        disabled
                        style={{ pointerEvents: 'none' }}
                        className='w-5 h-5'
                      />
                      <Text variant='content'>{opt}</Text>
                    </div>
                  ))}
                </div>
              ) : null;
            case 'checkbox':
              return field.options?.length ? (
                <div className='flex flex-col gap-2'>
                  {field.options.map((opt, i) => (
                    <div
                      key={`radio-option-${i}`}
                      className='flex items-center gap-2'
                    >
                      <Input
                        type='checkbox'
                        disabled
                        style={{ pointerEvents: 'none' }}
                        className='w-5 h-5'
                      />
                      <Text variant='content'>{opt}</Text>
                    </div>
                  ))}
                </div>
              ) : null;
            case 'select':
              return field.options?.length ? (
                <div className='relative w-full group'>
                  <div className='border rounded-md p-2 bg-white cursor-pointer'>
                    {field.hint || '請選擇選項'}
                  </div>
                  <div className='hidden group-hover:block  w-full border rounded-md bg-white shadow-md mt-1 z-50'>
                    {field.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className='p-2 hover:bg-gray-200 cursor-pointer'
                      >
                        {opt || `選項 ${idx + 1}`} {/* 空值也可補預設 */}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            case 'description':
              return (
                <Text variant='note' className='w-full'>
                  {field.noteContent}
                </Text>
              );
            default:
              return null;
          }
        })()}
        <Text variant='content' className='w-full'>
          {field.description}
        </Text>
      </div>

      <div className='h-full flex flex-row justify-center items-center gap-4 group-hover:opacity-100 opacity-0'>
        <Button
          type='button'
          variant='primary'
          className='rounded-full w-9 h-9'
          onClick={e => deleteField(e, field.id)}
        >
          刪除
        </Button>

        <Button
          type='button'
          variant='primary'
          className='primary w-9 h-9 rounded-full cursor-grab'
          ref={dragButtonRef} // 觸發拖曳
          onClick={() => setToggleAreaIndex(-1)}
        >
          拖曳
        </Button>
      </div>
    </div>
  );
};
