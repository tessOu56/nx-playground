import { style } from '@vanilla-extract/css';

// 基礎圖標按鈕樣式
export const baseIconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  fontWeight: '500',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  ':focus': {
    outline: '2px solid',
    outlineOffset: '2px',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

// 主要圖標按鈕樣式
export const primaryIconButton = style({
  backgroundColor: 'var(--color-brand-600)',
  color: 'white',
  ':hover': {
    backgroundColor: 'var(--color-brand-700)',
  },
  ':active': {
    backgroundColor: 'var(--color-brand-800)',
  },
  ':focus': {
    outlineColor: 'var(--color-brand-500)',
  },
});

// 次要圖標按鈕樣式
export const secondaryIconButton = style({
  backgroundColor: 'var(--color-brand-100)',
  color: 'var(--color-brand-700)',
  ':hover': {
    backgroundColor: 'var(--color-brand-200)',
  },
  ':active': {
    backgroundColor: 'var(--color-brand-300)',
  },
  ':focus': {
    outlineColor: 'var(--color-brand-500)',
  },
});

// 外框圖標按鈕樣式
export const outlineIconButton = style({
  backgroundColor: 'transparent',
  color: 'var(--color-brand-600)',
  border: '1px solid var(--color-brand-300)',
  ':hover': {
    backgroundColor: 'var(--color-brand-50)',
    borderColor: 'var(--color-brand-400)',
  },
  ':active': {
    backgroundColor: 'var(--color-brand-100)',
  },
  ':focus': {
    outlineColor: 'var(--color-brand-500)',
  },
});

// 幽靈圖標按鈕樣式
export const ghostIconButton = style({
  backgroundColor: 'transparent',
  color: 'var(--color-gray-600)',
  ':hover': {
    backgroundColor: 'var(--color-gray-100)',
    color: 'var(--color-gray-800)',
  },
  ':active': {
    backgroundColor: 'var(--color-gray-200)',
  },
  ':focus': {
    outlineColor: 'var(--color-gray-500)',
  },
});

// 預設圖標按鈕樣式
export const defaultIconButton = style({
  backgroundColor: 'var(--color-brand-600)',
  color: 'white',
  border: '1px solid var(--color-brand-600)',
  ':hover': {
    backgroundColor: 'var(--color-brand-700)',
    borderColor: 'var(--color-brand-700)',
  },
  ':active': {
    backgroundColor: 'var(--color-brand-800)',
  },
});

// 危險圖標按鈕樣式
export const destructiveIconButton = style({
  backgroundColor: 'var(--color-error-600)',
  color: 'white',
  ':hover': {
    backgroundColor: 'var(--color-error-700)',
  },
  ':active': {
    backgroundColor: 'var(--color-error-800)',
  },
});

// 尺寸樣式
export const sizeIconSm = style({
  width: '32px',
  height: '32px',
  fontSize: '14px',
});

export const sizeIconMd = style({
  width: '40px',
  height: '40px',
  fontSize: '16px',
});

export const sizeIconLg = style({
  width: '48px',
  height: '48px',
  fontSize: '18px',
});
