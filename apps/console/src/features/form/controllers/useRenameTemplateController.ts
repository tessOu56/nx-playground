import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@nx-playground/ui-components';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { renameTemplateSchema } from '../schemas';

interface UseRenameTemplateControllerProps {
  currentName: string;
  onSave: (newName: string) => Promise<void>;
  onClose: () => void;
}

export const useRenameTemplateController = ({
  currentName,
  onSave,
  onClose,
}: UseRenameTemplateControllerProps) => {
  const { addToast } = useToast();
  const originalNameRef = useRef(currentName);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(renameTemplateSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const watchedName = watch('name');

  // 重置到原始名稱
  const resetToOriginal = useCallback(() => {
    reset({ name: originalNameRef.current });
  }, [reset]);

  // 處理取消
  const handleCancel = useCallback(() => {
    resetToOriginal();
    onClose();
  }, [resetToOriginal, onClose]);

  // 處理提交
  const handleSave = useCallback(
    async (data: { name: string }) => {
      try {
        await onSave(data.name);
        addToast({
          message: '模板名稱已更新',
          type: 'success',
        });
        onClose();
      } catch (error) {
        // 捕獲錯誤並顯示通知
        addToast({
          message: '更新模板名稱失敗',
          type: 'error',
        });
        // 重新拋出錯誤，讓上層組件知道操作失敗
        throw error;
      }
    },
    [onSave, onClose, addToast]
  );

  // 處理鍵盤事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleCancel]
  );

  // 當 currentName 改變時更新 ref
  useLayoutEffect(() => {
    originalNameRef.current = currentName;
  }, [currentName]);

  return {
    register,
    handleSubmit: handleSubmit(handleSave),
    errors,
    isSubmitting,
    resetToOriginal,
    handleCancel,
    handleKeyDown,
    watchedName,
  };
};
