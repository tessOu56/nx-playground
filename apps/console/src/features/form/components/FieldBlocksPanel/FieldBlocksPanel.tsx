import { type FC } from 'react';

import { type FieldType } from '../../types';

interface FieldBlocksPanelProps {
  fieldTypes: FieldType[];
  draggedFieldType: string | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fieldType: string) => void;
  onDragEnd: () => void;
  onAddField: (fieldType: string) => void;
}

export const FieldBlocksPanel: FC<FieldBlocksPanelProps> = ({
  fieldTypes,
  draggedFieldType,
  onDragStart,
  onDragEnd,
  onAddField,
}) => {
  return (
    <div className='w-72 flex-shrink-0 bg-background-secondary/50 border-r border-border-primary p-4 overflow-y-auto'>
      <h2 className='text-lg font-medium text-text-secondary'>表單區塊</h2>

      {/* 問題區塊 */}
      <h3 className='text-base font-medium text-text-secondary mt-2'>
        問題區塊
      </h3>
      <div className='space-y-2'>
        {fieldTypes.map(type => (
          <div
            key={type.id}
            draggable
            className={`p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-colors bg-background-primary ${
              draggedFieldType === type.id ? 'opacity-50' : ''
            }`}
            onDragStart={e => onDragStart(e, type.id)}
            onDragEnd={onDragEnd}
            onClick={() => onAddField(type.id)}
          >
            <div className='flex items-center gap-3'>
              <span className='text-xl'>{type.icon}</span>
              <div>
                <div className='font-medium text-sm'>{type.name}</div>
                <div className='text-xs text-gray-500'>{type.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 說明區塊 */}
      <h3 className='text-base font-medium text-text-secondary mt-3'>
        說明區塊
      </h3>
      <div
        draggable
        className={`p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-colors bg-background-primary ${
          draggedFieldType === 'description' ? 'opacity-50' : ''
        }`}
        onDragStart={e => onDragStart(e, 'description')}
        onDragEnd={onDragEnd}
        onClick={() => onAddField('description')}
      >
        <div className='flex items-center gap-3'>
          <span className='text-xl' role='img' aria-label='說明區塊'>
            📝
          </span>
          <div>
            <div className='font-medium text-sm'>說明區塊</div>
            <div className='text-xs text-gray-500'>
              在表單中添加說明文字，幫助用戶理解表單內容
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
