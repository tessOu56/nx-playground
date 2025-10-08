'use client';

import { forwardRef, type MouseEvent, type ReactNode } from 'react';

import {
  baseIconButton,
  defaultIconButton,
  destructiveIconButton,
  ghostIconButton,
  outlineIconButton,
  primaryIconButton,
  secondaryIconButton,
  sizeIconLg,
  sizeIconMd,
  sizeIconSm,
} from './IconButton.css';

export interface IconButtonProps {
  children: ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'primary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      disabled = false,
      onClick,
      className = '',
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // 根據變體選擇樣式
    const variantStyle = {
      default: defaultIconButton,
      destructive: destructiveIconButton,
      outline: outlineIconButton,
      secondary: secondaryIconButton,
      ghost: ghostIconButton,
      primary: primaryIconButton,
    }[variant];

    // 根據尺寸選擇樣式
    const sizeStyle = {
      sm: sizeIconSm,
      md: sizeIconMd,
      lg: sizeIconLg,
    }[size];

    return (
      <button
        ref={ref}
        className={`${baseIconButton} ${variantStyle} ${sizeStyle} ${className}`}
        onClick={onClick}
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
