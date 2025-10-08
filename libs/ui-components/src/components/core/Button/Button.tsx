'use client';

import { forwardRef, type ReactNode, type MouseEvent } from 'react';

import {
  baseButton,
  defaultButton,
  destructiveButton,
  ghostButton,
  linkButton,
  outlineButton,
  primaryButton,
  secondaryButton,
  sizeLg,
  sizeMd,
  sizeSm,
} from './Button.css';

export interface ButtonProps {
  children: ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  _asChild?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      disabled = false,
      onClick,
      className = '',
      _asChild = false,
      ...props
    },
    ref
  ) => {
    // 根據變體選擇樣式
    const variantStyle = {
      default: defaultButton,
      destructive: destructiveButton,
      outline: outlineButton,
      secondary: secondaryButton,
      ghost: ghostButton,
      link: linkButton,
      primary: primaryButton,
    }[variant];

    // 根據尺寸選擇樣式
    const sizeStyle = {
      default: sizeMd,
      sm: sizeSm,
      lg: sizeLg,
      icon: sizeSm, // icon 尺寸使用 sm
    }[size];

    return (
      <button
        ref={ref}
        className={`${baseButton} ${variantStyle} ${sizeStyle} ${className}`}
        onClick={onClick}
        disabled={disabled}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
