import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';
import { type FC, type MouseEvent } from 'react';

import { type FormTemplateListItem } from '../types';

import { FormTemplateTooltip } from './FormTemplateTooltip';

import { FormTemplateActions } from './index';

interface FormTemplateCardProps {
  template: FormTemplateListItem;
  isSelected: boolean;
  canCreateNew: boolean;
  onSelect: (template: FormTemplateListItem) => void;
  onCopy: (template: FormTemplateListItem) => Promise<void>;
  onDelete: (template: FormTemplateListItem) => Promise<void>;
  onRename: (template: FormTemplateListItem, newName: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

export const FormTemplateCard: FC<FormTemplateCardProps> = ({
  template,
  isSelected,
  canCreateNew,
  onSelect,
  onCopy,
  onDelete,
  onRename,
  formatDate,
}) => {
  const handleCardClick = () => {
    onSelect(template);
  };

  const handleDropdownClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      data-template-card
      variant='interactive'
      selected={isSelected}
      className='h-36 min-w-0'
      onClick={handleCardClick}
    >
      <CardHeader className='pb-0 min-w-0 p-6'>
        <div className='flex justify-between items-start min-w-0 gap-6'>
          <div className='flex-1 min-w-0'>
            <FormTemplateTooltip content={template.name}>
              <CardTitle className='text-lg leading-6 h-[60px] flex items-center overflow-hidden'>
                <span className='line-clamp-2 text-left w-full'>
                  {template.name}
                </span>
              </CardTitle>
            </FormTemplateTooltip>
          </div>
          <div onClick={handleDropdownClick}>
            <FormTemplateActions
              templateName={template.name}
              canCreateNew={canCreateNew}
              onRename={onRename}
              onCopy={onCopy}
              onDelete={onDelete}
              template={template}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-0 px-6 pb-6 flex-1 flex items-end'>
        <div className='text-sm text-gray-600 w-full'>
          <div>
            <span className='font-medium'>最後編輯時間：</span>
            {formatDate(template.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
