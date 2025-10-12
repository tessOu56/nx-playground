'use client';

import {
  FormButton as UIFormButton,
  type FormButtonProps,
} from '@nx-playground/ui-components';
import { useState, useCallback, type MouseEvent } from 'react';

interface ButtonProps extends Omit<FormButtonProps, 'onClick'> {
  /** 點擊事件處理函數，支援異步操作 */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** 防抖延遲時間（毫秒），預設 300ms */
  debounceMs?: number;
}

/**
 * 封裝的按鈕組件，提供防抖、loading 狀態和錯誤處理
 *
 * @example
 * ```tsx
 * // 基本使用
 * <Button onClick={handleClick}>點擊我</Button>
 *
 * // 帶樣式變體
 * <Button variant="primary" size="lg">主要按鈕</Button>
 *
 * // 異步操作
 * <Button onClick={async () => await saveData()}>儲存</Button>
 *
 * // 自定義防抖時間
 * <Button onClick={handleClick} debounceMs={500}>防抖按鈕</Button>
 * ```
 */
export function Button({
  onClick,
  debounceMs = 300,
  loading: externalLoading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (
        disabled ||
        externalLoading ||
        internalLoading ||
        isProcessing ||
        !onClick
      ) {
        return;
      }

      setIsProcessing(true);
      setInternalLoading(true);

      try {
        await onClick(e);
      } catch (error) {
        console.error('Button click error:', error);
      } finally {
        // 添加防抖延遲
        setTimeout(() => {
          setInternalLoading(false);
          setIsProcessing(false);
        }, debounceMs);
      }
    },
    [
      onClick,
      disabled,
      externalLoading,
      internalLoading,
      isProcessing,
      debounceMs,
    ]
  );

  return (
    <UIFormButton
      {...props}
      onClick={handleClick}
      loading={externalLoading || internalLoading}
      disabled={disabled || isProcessing}
    />
  );
}
