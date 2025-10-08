import { type FC } from 'react';

import { FormTemplateTooltip } from './FormTemplateTooltip';

interface FormTemplateTitleProps {
  title: string;
  className?: string;
}

export const FormTemplateTitle: FC<FormTemplateTitleProps> = ({
  title,
  className = '',
}) => {
  return (
    <FormTemplateTooltip content={title}>
      <div
        className={`text-lg leading-6 h-[60px] flex items-center overflow-hidden ${className}`}
      >
        <span className='line-clamp-2 text-left w-full'>{title}</span>
      </div>
    </FormTemplateTooltip>
  );
};
