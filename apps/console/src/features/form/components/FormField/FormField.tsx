import { Button } from '@nx-playground/ui-components';
import { Trash2, GripVertical } from 'lucide-react';
import { type FC, useState } from 'react';

import { type FormField as FormFieldType, type FieldType } from '../../types';

interface FormFieldProps {
  field: FormFieldType;
  fieldTypes: FieldType[];
  selectedField: FormFieldType | null;
  onFieldSelect: (field: FormFieldType) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    field: FormFieldType
  ) => void;
  onFieldDragEnd: () => void;
}

export const FormField: FC<FormFieldProps> = ({
  field,
  fieldTypes,
  selectedField,
  onFieldSelect,
  onFieldDelete,
  onFieldDragStart,
  onFieldDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    onFieldDragStart(e, field);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onFieldDragEnd();
  };

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        selectedField?.id === field.id
          ? 'border-blue-500 bg-blue-50'
          : 'hover:bg-gray-50'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onFieldSelect(field)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <span className='text-lg'>
            {fieldTypes.find(t => t.id === field.type)?.icon ?? '📝'}
          </span>
          <div>
            <div className='font-medium text-sm'>{field.label}</div>
            <div className='text-xs text-gray-500'>
              {fieldTypes.find(t => t.id === field.type)?.name ?? field.type}
              {field.validation?.required && ' (必填)'}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          {/* 拖拽手柄 */}
          <div
            className='p-1 h-6 w-6 cursor-grab active:cursor-grabbing flex items-center justify-center hover:bg-gray-100 rounded'
            onMouseDown={e => {
              e.stopPropagation();
            }}
          >
            <GripVertical className='h-3 w-3 text-gray-400' />
          </div>

          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              onFieldDelete(field.id);
            }}
            className='p-1 h-6 w-6 text-red-500 hover:text-red-700'
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
};
