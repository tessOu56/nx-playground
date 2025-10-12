import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';
import { type FC } from 'react';

interface DeleteTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  templateName: string;
  loading?: boolean;
}

export const DeleteTemplateDialog: FC<DeleteTemplateDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateName,
  loading = false,
}) => {
  const handleConfirm = async () => {
    // 立即關閉對話框
    onClose();
    // 然後執行刪除操作
    await onConfirm();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className='fixed inset-0 z-50 bg-black bg-opacity-50' />

      {/* Dialog */}
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <Card className='w-full max-w-md mx-4 shadow-xl bg-white'>
          <CardHeader>
            <CardTitle className='text-lg'>確定要刪除此模板？</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm text-gray-700'>此操作無法復原</p>
              {templateName && (
                <p className='text-sm text-gray-600'>
                  模板名稱：<span className='font-medium'>{templateName}</span>
                </p>
              )}
            </div>
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='primary'
                onClick={onClose}
                disabled={loading}
                className='flex-1'
              >
                取消
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={handleConfirm}
                disabled={loading}
                className='flex-1'
              >
                {loading ? '刪除中...' : '確認刪除'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
