import { TooltipWithArrow } from '@nx-playground/ui-components';
import * as React from 'react';

interface FormTemplateTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const FormTemplateTooltip: React.FC<FormTemplateTooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  className = '',
}) => {
  return (
    <TooltipWithArrow
      content={content}
      side={side}
      align={align}
      contentClassName={`max-w-[296px] p-2 ${className}`}
    >
      {children}
    </TooltipWithArrow>
  );
};
