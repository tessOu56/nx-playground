import { style } from '@vanilla-extract/css';

// 基礎按鈕樣式
export const baseButton = style({
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

// 主要按鈕樣式 - 使用主題顏色
export const primaryButton = style({
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

// 次要按鈕樣式 - 使用主題顏色
export const secondaryButton = style({
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

// 外框按鈕樣式 - 使用主題顏色
export const outlineButton = style({
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

// 幽靈按鈕樣式 - 使用主題顏色
export const ghostButton = style({
  backgroundColor: 'transparent',
  color: 'var(--color-brand-600)',
  ':hover': {
    backgroundColor: 'var(--color-brand-50)',
  },
  ':active': {
    backgroundColor: 'var(--color-brand-100)',
  },
  ':focus': {
    outlineColor: 'var(--color-brand-500)',
  },
});

// 尺寸樣式
export const sizeSm = style({
  padding: '6px 12px',
  fontSize: '14px',
  lineHeight: '20px',
});

export const sizeMd = style({
  padding: '8px 16px',
  fontSize: '16px',
  lineHeight: '24px',
});

export const sizeLg = style({
  padding: '12px 20px',
  fontSize: '18px',
  lineHeight: '28px',
});

// 預設按鈕樣式 - 使用主題顏色
export const defaultButton = style({
  backgroundColor: 'var(--color-brand-600)',
  color: 'white',
  border: '1px solid var(--color-brand-600)',
  ':hover': {
    backgroundColor: 'var(--color-brand-700)',
    borderColor: 'var(--color-brand-700)',
  },
  ':active': {
    backgroundColor: 'var(--color-brand-800)',
    borderColor: 'var(--color-brand-800)',
  },
  ':focus': {
    outlineColor: 'var(--color-brand-500)',
  },
});

export const destructiveButton = style({
  backgroundColor: 'var(--color-error-600)',
  color: 'white',
  ':hover': {
    backgroundColor: 'var(--color-error-700)',
  },
  ':active': {
    backgroundColor: 'var(--color-error-800)',
  },
});

export const linkButton = style({
  color: 'var(--color-brand-600)',
  textDecoration: 'underline',
  ':hover': {
    color: 'var(--color-brand-700)',
  },
  ':active': {
    color: 'var(--color-brand-800)',
  },
});
