import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nx-playground/ui-components';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import * as React from 'react';

import { type FormField, type FormFieldType } from '../types';

interface FormFieldEditorProps {
  field: FormField;
  onUpdate: (fieldId: string, field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onReorder: (fieldId: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const fieldTypeOptions: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: '文字輸入' },
  { value: 'email', label: '電子郵件' },
  { value: 'tel', label: '電話號碼' },
  { value: 'number', label: '數字' },
  { value: 'date', label: '日期' },
  { value: 'textarea', label: '多行文字' },
  { value: 'select', label: '下拉選單' },
  { value: 'checkbox', label: '複選框' },
  { value: 'radio', label: '單選框' },
];

export const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
  field,
  onUpdate,
  onDelete,
  onReorder,
  isFirst,
  isLast,
}) => {
  const handleUpdate = (updates: Partial<FormField>) => {
    onUpdate(field.id, { ...field, ...updates });
  };

  const handleAddOption = () => {
    const newOptions = [
      ...(field.options ?? []),
      `選項 ${(field.options?.length ?? 0) + 1}`,
    ];
    handleUpdate({ options: newOptions });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...(field.options ?? [])];
    newOptions[index] = value;
    handleUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index) ?? [];
    handleUpdate({ options: newOptions });
  };

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='space-y-4'>
          {/* 字段標題和操作 */}
          <div className='flex justify-between items-center'>
            <h3 className='font-medium text-gray-900'>字段 {field.order}</h3>
            <div className='flex gap-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onReorder(field.id, 'up')}
                disabled={isFirst}
              >
                <ChevronUp className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onReorder(field.id, 'down')}
                disabled={isLast}
              >
                <ChevronDown className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onDelete(field.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* 字段類型 */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              字段類型
            </label>
            <Select
              value={field.type}
              onValueChange={(value: FormFieldType) =>
                handleUpdate({ type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 字段標籤 */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              標籤 *
            </label>
            <Input
              value={field.label}
              onChange={e => handleUpdate({ label: e.target.value })}
              placeholder='請輸入字段標籤'
            />
          </div>

          {/* 佔位符文字 */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              佔位符文字
            </label>
            <Input
              value={field.placeholder ?? ''}
              onChange={e => handleUpdate({ placeholder: e.target.value })}
              placeholder='請輸入佔位符文字'
            />
          </div>

          {/* 選項設定 (用於 select 和 radio) */}
          {(field.type === 'select' || field.type === 'radio') && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                選項
              </label>
              <div className='space-y-2'>
                {field.options?.map((option, index) => (
                  <div
                    key={`${field.id}-option-${index}`}
                    className='flex gap-2'
                  >
                    <Input
                      value={option}
                      onChange={e => handleUpdateOption(index, e.target.value)}
                      placeholder={`選項 ${index + 1}`}
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleRemoveOption(index)}
                    >
                      刪除
                    </Button>
                  </div>
                ))}
                <Button variant='outline' size='sm' onClick={handleAddOption}>
                  新增選項
                </Button>
              </div>
            </div>
          )}

          {/* 驗證設定 */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              驗證設定
            </label>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id={`required-${field.id}`}
                checked={field.validation?.required ?? false}
                onChange={e =>
                  handleUpdate({
                    validation: {
                      ...field.validation,
                      required: e.target.checked,
                    },
                  })
                }
                className='rounded border-gray-300'
              />
              <label
                htmlFor={`required-${field.id}`}
                className='text-sm text-gray-700'
              >
                必填
              </label>
            </div>

            {/* 數字驗證 */}
            {field.type === 'number' && (
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>
                    最小值
                  </label>
                  <Input
                    type='number'
                    value={field.validation?.min ?? ''}
                    onChange={e =>
                      handleUpdate({
                        validation: {
                          ...field.validation,
                          min: Number(e.target.value) || undefined,
                        },
                      })
                    }
                    placeholder='最小值'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>
                    最大值
                  </label>
                  <Input
                    type='number'
                    value={field.validation?.max ?? ''}
                    onChange={e =>
                      handleUpdate({
                        validation: {
                          ...field.validation,
                          max: Number(e.target.value) || undefined,
                        },
                      })
                    }
                    placeholder='最大值'
                  />
                </div>
              </div>
            )}

            {/* 自定義驗證訊息 */}
            <div>
              <label className='block text-xs text-gray-600 mb-1'>
                驗證錯誤訊息
              </label>
              <Input
                value={field.validation?.message ?? ''}
                onChange={e =>
                  handleUpdate({
                    validation: {
                      ...field.validation,
                      message: e.target.value,
                    },
                  })
                }
                placeholder='請輸入驗證錯誤訊息'
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
