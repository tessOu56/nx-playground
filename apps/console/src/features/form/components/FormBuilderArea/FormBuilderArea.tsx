import { type FC } from 'react';

import { type FormField, type FieldType } from '../../types';
import { DropZone } from '../DropZone';
import { FormField as FormFieldComponent } from '../FormField';

interface FormBuilderAreaProps {
  fields: FormField[];
  fieldTypes: FieldType[];
  selectedField: FormField | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, position?: number) => void;
  onFieldSelect: (field: FormField) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldReorder: (fieldId: string, direction: 'up' | 'down') => void;
  onFieldDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    field: FormField
  ) => void;
  onFieldDragEnd: () => void;
  onFieldDrop: (
    e: React.DragEvent<HTMLDivElement>,
    targetPosition: number
  ) => void;
}

export const FormBuilderArea: FC<FormBuilderAreaProps> = ({
  fields,
  fieldTypes,
  selectedField,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFieldSelect,
  onFieldDelete,
  onFieldDragStart,
  onFieldDragEnd,
  onFieldDrop,
}) => {
  return (
    <div
      className={`flex-1 bg-gray-100 border-2 border-dashed p-6 overflow-y-auto ${
        isDragOver ? 'border-blue-300 transition-colors ' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={e => {
        const draggedFieldId = e.dataTransfer.getData('field-id');
        if (draggedFieldId) {
          onFieldDrop(e, fields.length);
        } else {
          onDrop(e, fields.length);
        }
      }}
    >
      <div className='space-y-4 max-w-3xl'>
        {fields.length === 0 ? (
          <div className='text-center py-16 text-gray-500'>
            <div className='w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>+</span>
            </div>
            <p className='text-lg font-medium mb-2'>
              從左側拖拽欄位到這裡開始建立表單
            </p>
            <p className='text-sm'>或點擊左側欄位直接新增</p>
          </div>
        ) : (
          <div className='space-y-0 '>
            {/* 開頭拖拽區域 */}
            <DropZone
              position={0}
              onDrop={(e, position) => {
                const draggedFieldId = e.dataTransfer.getData('field-id');
                if (draggedFieldId) {
                  onFieldDrop(e, position);
                } else {
                  onDrop(e, position);
                }
              }}
            />
            {/* Field */}
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormFieldComponent
                  field={field}
                  fieldTypes={fieldTypes}
                  selectedField={selectedField}
                  onFieldSelect={onFieldSelect}
                  onFieldDelete={onFieldDelete}
                  onFieldDragStart={onFieldDragStart}
                  onFieldDragEnd={onFieldDragEnd}
                />
                {/* 欄位間拖拽區域 */}
                {index < fields.length - 1 && (
                  <DropZone
                    position={index + 1}
                    onDrop={(e, position) => {
                      const draggedFieldId = e.dataTransfer.getData('field-id');
                      if (draggedFieldId) {
                        onFieldDrop(e, position);
                      } else {
                        onDrop(e, position);
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 結尾拖拽區域 */}
      <DropZone
        position={fields.length}
        onDrop={(e, position) => {
          const draggedFieldId = e.dataTransfer.getData('field-id');
          if (draggedFieldId) {
            onFieldDrop(e, position);
          } else {
            onDrop(e, position);
          }
        }}
        isDragOver={isDragOver}
      />
    </div>
  );
};
