import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@nx-playground/ui-components';
import { Copy, MoreVertical, Trash2, Type } from 'lucide-react';
import { type FC, useState } from 'react';

import { type FormTemplateListItem } from '../types';

import { DeleteTemplateDialog, RenameTemplateDialog } from './index';

interface FormTemplateActionsProps {
  templateName: string;
  canCreateNew?: boolean;
  onRename: (template: FormTemplateListItem, newName: string) => Promise<void>;
  onCopy: (template: FormTemplateListItem) => Promise<void>;
  onDelete: (template: FormTemplateListItem) => Promise<void>;
  template: FormTemplateListItem;
  loading?: boolean;
  showCopy?: boolean;
  icon?: React.ReactNode;
}

export const FormTemplateActions: FC<FormTemplateActionsProps> = ({
  templateName,
  canCreateNew = true,
  onRename,
  onCopy,
  onDelete,
  template,
  loading = false,
  showCopy = true,
  icon = <MoreVertical className='h-4 w-4' />,
}) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleRename = () => {
    setRenameDialogOpen(true);
  };

  const handleRenameSave = async (newName: string) => {
    try {
      await onRename(template, newName);
      setRenameDialogOpen(false);
    } catch (error) {
      // 錯誤處理已經在 onRename 中完成
      // eslint-disable-next-line no-console
      console.error('Rename failed:', error);
    }
  };

  const handleCopy = async () => {
    await onCopy(template);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(template);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
            {icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={handleRename}>
            <Type className='mr-2 h-4 w-4' />
            重新命名
          </DropdownMenuItem>
          {showCopy && (
            <DropdownMenuItem onClick={handleCopy} disabled={!canCreateNew}>
              <Copy className='mr-2 h-4 w-4' />
              複製
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
            <Trash2 className='mr-2 h-4 w-4' />
            刪除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 重新命名對話框 */}
      <RenameTemplateDialog
        isOpen={renameDialogOpen}
        currentName={templateName}
        onSave={handleRenameSave}
        onClose={() => setRenameDialogOpen(false)}
        loading={loading}
      />

      {/* 刪除確認對話框 */}
      <DeleteTemplateDialog
        isOpen={deleteDialogOpen}
        templateName={templateName}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
