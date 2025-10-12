import { Button, TooltipProvider } from '@nx-playground/ui-components';
import { type FC, useMemo } from 'react';

import { formatDate } from '../../../lib';
import { FormTemplateCard, FormTemplatePreview } from '../components';
import { useFormTemplateActions } from '../hooks/useFormTemplateActions';
import { useFormTemplatesQuery } from '../hooks/useFormTemplateQueries';
import { useFormTemplateStore } from '../stores/useFormTemplateStore';
import { type FormTemplateListItem } from '../types';

/**
 * 表單模板列表頁面
 *
 * 提供表單模板的管理功能，包括：
 * - 顯示所有表單模板列表
 * - 新增、複製、刪除、重新命名模板
 * - 模板預覽功能
 * - 模板選擇和導航
 *
 * @returns JSX.Element
 */
export const FormTemplateListPage: FC = () => {
  /** 表單模板操作 hooks */
  const {
    handleCopyTemplate,
    handleDeleteTemplate,
    handleRenameTemplate,
    handleCreateTemplate,
    handleTemplateClick,
    canCreateNew,
  } = useFormTemplateActions();

  /** React Query 數據獲取 */
  const { data: formTemplates = [], isLoading } = useFormTemplatesQuery();

  /** 表單模板 UI 狀態管理 */
  const { selectedTemplateId, currentTemplate, setSelectedTemplateId } =
    useFormTemplateStore();

  // 排序模板列表（按更新時間降序）
  const sortedTemplates = useMemo(() => {
    return [...formTemplates].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [formTemplates]);

  /**
   * 處理點擊外部區域取消選取
   *
   * 當用戶點擊模板卡片外的區域時，取消當前選中的模板
   *
   * @param e - 滑鼠點擊事件
   */
  const handleClickOutside = (e: React.MouseEvent) => {
    // 檢查是否點擊在左側列表區域（不包括預覽區域）
    const target = e.target as HTMLElement;
    const leftPanel = target.closest('.left-panel');
    const card = target.closest('[data-template-card]');
    const previewArea = target.closest('.preview-area');

    // 如果點擊在左側面板但不在卡片上，或點擊在預覽區域下方空白處，則取消選取
    if (
      (leftPanel && !card) ||
      (previewArea && !target.closest('.preview-content'))
    ) {
      setSelectedTemplateId(null);
    }
  };

  /**
   * 處理新增模板按鈕點擊
   *
   * 創建一個新的未命名表單模板
   */
  const handleCreateTemplateClick = async () => {
    try {
      await handleCreateTemplate('未命名表單');
    } catch (_err) {
      // 錯誤處理由 hook 處理
    }
  };

  return (
    <TooltipProvider>
      <div className='flex gap-6 h-full min-w-0'>
        {/* 左側列表區域 */}
        <div
          className='flex-1 space-y-6 left-panel min-w-0'
          onClick={handleClickOutside}
        >
          <div className='space-y-4 py-4'>
            {/* 頁面標題和描述 */}
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                報名表模板管理
              </h1>
              <p className='text-gray-600 mt-1'>
                新增並管理報名表模板，建立活動時快速選用。
              </p>
            </div>
            {/* 操作區域：標題和新增按鈕 */}
            <div className='flex justify-between items-center py-2'>
              <h2 className='text-lg font-medium text-gray-900'>全部模板</h2>
              <Button
                variant='primary'
                disabled={!canCreateNew() || isLoading}
                onClick={handleCreateTemplateClick}
              >
                新增模板
              </Button>
            </div>
            {/* 狀態提示訊息 */}
            {formTemplates.length === 0 && (
              <p className='text-xs text-gray-500 text-right'>
                目前沒有任何表單模板，點選新增表單模板，即可開始
              </p>
            )}

            {!canCreateNew() && (
              <p className='text-xs text-gray-500 text-right'>
                已達模板數量上限 3 個，無法再新增模板
              </p>
            )}
          </div>

          {/* 模板卡片列表 */}
          <div className='grid gap-4 min-w-0'>
            {sortedTemplates.map((template: FormTemplateListItem) => (
              <FormTemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                canCreateNew={canCreateNew()}
                onSelect={handleTemplateClick}
                onCopy={handleCopyTemplate}
                onDelete={handleDeleteTemplate}
                onRename={handleRenameTemplate}
                formatDate={formatDate}
              />
            ))}
          </div>

          {/* 載入和空狀態 */}
          {isLoading && (
            <div className='text-center py-12'>
              <p className='text-gray-500 mb-4'>Loading...</p>
            </div>
          )}

          {sortedTemplates.length === 0 && !isLoading && (
            <div className='text-center py-12'>
              <p className='text-gray-500 mb-4'>尚無模板</p>
            </div>
          )}
        </div>

        {/* 右側預覽區域 */}
        <div
          className='w-96 flex-shrink-0 preview-area min-w-0'
          onClick={handleClickOutside}
        >
          {/* 模板預覽組件 */}
          <div className='sticky top-6 preview-content min-w-0'>
            <FormTemplatePreview
              selectedTemplate={currentTemplate}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
