'use client';

import { Button as EdsButton } from '@is_tess/components/core';
import { useCallback, useState, type ComponentProps, type MouseEvent } from 'react';

type EdsButtonProps = ComponentProps<typeof EdsButton>;

type ButtonVariant = EdsButtonProps['variant'] | 'primary';

interface ButtonProps extends Omit<EdsButtonProps, 'variant' | 'onClick'> {
  variant?: ButtonVariant;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  debounceMs?: number;
  loading?: boolean;
}

export function Button({
  onClick,
  debounceMs = 300,
  loading: externalLoading = false,
  disabled = false,
  variant,
  ...props
}: ButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled || externalLoading || internalLoading || isProcessing || !onClick) {
        return;
      }

      setIsProcessing(true);
      setInternalLoading(true);

      try {
        await onClick(e);
      } catch (error) {
        console.error('Button click error:', error);
      } finally {
        setTimeout(() => {
          setInternalLoading(false);
          setIsProcessing(false);
        }, debounceMs);
      }
    },
    [onClick, disabled, externalLoading, internalLoading, isProcessing, debounceMs]
  );

  return (
    <EdsButton
      {...props}
      variant={variant === 'primary' ? 'default' : variant}
      onClick={handleClick}
      disabled={disabled || isProcessing || externalLoading || internalLoading}
    />
  );
}
