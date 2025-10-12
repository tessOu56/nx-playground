import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from '@nx-playground/ui-components';
import { Edit, Eye } from 'lucide-react';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { type FormTemplateListItem } from '../types';

import { FormTemplateTitle } from './FormTemplateTitle';

interface FormTemplatePreviewProps {
  selectedTemplate: FormTemplateListItem | null;
  formatDate: (dateString: string) => string;
}

export const FormTemplatePreview: FC<FormTemplatePreviewProps> = ({
  selectedTemplate,
  formatDate,
}) => {
  if (!selectedTemplate) {
    return (
      <Card className='min-w-0'>
        <CardContent className='text-center py-12 preview-content min-w-0'>
          <Eye className='mx-auto h-12 w-12 mb-4 text-gray-400' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            請點選模板卡片以預覽
          </h3>
          <p className='text-gray-500 text-sm'>
            選擇左側的模板卡片來查看詳細資訊和預覽
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='min-w-0'>
      <CardHeader className='min-w-0'>
        <div className='flex justify-between items-start gap-2 min-w-0'>
          <FormTemplateTitle
            title={selectedTemplate.name}
            className='flex-1 min-w-0'
          />
          <Link to={`/forms/edit/${selectedTemplate.id}`}>
            <Button variant='outline' size='sm' className='flex-shrink-0'>
              <Edit className='mr-2 h-4 w-4' />
              編輯
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <div className='text-sm text-gray-600'>
            最後編輯時間：{formatDate(selectedTemplate.updatedAt)}
          </div>
        </div>

        {/* 表單欄位預覽 */}
        <div className='pt-4'>
          {selectedTemplate.fields.length > 0 ? (
            <div className='space-y-3'>
              {selectedTemplate.fields.map(field => (
                <div key={field.id} className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      {field.label}
                    </label>
                    {field.validation?.required && (
                      <span className='text-xs text-red-500'>*</span>
                    )}
                  </div>
                  <Input
                    type={
                      field.type === 'email'
                        ? 'email'
                        : field.type === 'tel'
                        ? 'tel'
                        : field.type === 'number'
                        ? 'number'
                        : field.type === 'date'
                        ? 'date'
                        : 'text'
                    }
                    placeholder={field.placeholder ?? ''}
                    disabled
                    className='bg-gray-50'
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-6 text-gray-500'>
              <p className='text-sm'>尚無欄位</p>
              <p className='text-xs text-gray-400 mt-1'>請在編輯頁面添加欄位</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
