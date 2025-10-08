import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@nx-playground/ui-components';
import { type FC, useCallback, useLayoutEffect, useRef } from 'react';

import { useRenameTemplateController } from '../controllers';

interface RenameTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
  currentName: string;
  title?: string;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  showCancel?: boolean;
}

export const RenameTemplateDialog: FC<RenameTemplateDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  title = '重新命名',
  label = '模板名稱',
  placeholder = '請輸入模板名稱',
  loading = false,
  showCancel = true,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    resetToOriginal,
    handleCancel,
    handleKeyDown,
  } = useRenameTemplateController({
    currentName,
    onSave,
    onClose,
  });

  // 為了手動控制焦點，我們需要一個 ref
  const inputRef = useRef<HTMLInputElement>(null);

  // 合併 react-hook-form 的 ref 和我們自己的 ref
  const { ref: registerRef, ...registerProps } = register('name', {
    shouldUnregister: true,
  });
  const setRefs = useCallback(
    (element: HTMLInputElement | null) => {
      // 設置 react-hook-form 的 ref
      if (typeof registerRef === 'function') {
        registerRef(element);
      } else if (registerRef) {
        (
          registerRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = element;
      }
      // 設置我們的 ref
      inputRef.current = element;
    },
    [registerRef]
  );

  // 當彈窗打開時，重置表單到原始值並聚焦
  useLayoutEffect(() => {
    if (isOpen) {
      // 增加一個小延遲，確保彈窗完全渲染後再執行聚焦
      setTimeout(() => {
        // 使用 requestAnimationFrame 確保所有更新在下次畫面繪製前完成
        window.requestAnimationFrame(() => {
          resetToOriginal();
          // 直接使用 ref 來設定焦點並選取文字
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select(); // 確保文字被選取以保持焦點
          }
        });
      }, 100);
    }
  }, [isOpen, resetToOriginal]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className='fixed inset-0 z-50 bg-black bg-opacity-50' />

      {/* Dialog */}
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <Card className='w-full max-w-md mx-4 shadow-xl bg-white'>
          <CardHeader>
            <CardTitle className='text-lg'>{title}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='template-name'
                  className='text-sm font-medium text-gray-700'
                >
                  {label}
                </label>
                <Input
                  id='template-name'
                  {...registerProps}
                  ref={setRefs}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={loading || isSubmitting}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name.message}</p>
                )}
              </div>
              <div
                className={`flex pt-4 ${
                  showCancel ? 'justify-end space-x-2' : ''
                }`}
              >
                {showCancel && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancel}
                    disabled={loading || isSubmitting}
                    className={showCancel ? 'flex-1' : ''}
                  >
                    取消
                  </Button>
                )}
                <Button
                  type='submit'
                  variant='primary'
                  disabled={loading || isSubmitting}
                  className={showCancel ? 'flex-1' : 'w-full'}
                >
                  {isSubmitting ? '儲存中...' : '儲存'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
