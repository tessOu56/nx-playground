import { Button } from '@nx-playground/ui-components';
import { ChevronRight, ChevronDown, CloudUpload } from 'lucide-react';
import { type FC, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { truncateText } from '../../../lib';
import {
  FormFieldEditor,
  FormTemplateActions,
  FieldBlocksPanel,
  FormBuilderArea,
  FormTemplateTooltip,
} from '../components';
import { useFormTemplateEditController } from '../controllers/useFormTemplateEditController';
import { fieldTypes } from '../mock';
import { useFormTemplateStore } from '../stores/useFormTemplateStore';
import { type FormField } from '../types';

/**
 * 表單模板編輯頁面
 *
 * 提供表單模板的編輯功能，包括：
 * - 模板基本資訊編輯
 * - 動態表單欄位管理（新增、編輯、刪除、排序）
 * - 手動儲存功能
 * - 複製和刪除模板
 *
 * @returns JSX.Element
 */
export const FormTemplateEditPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== 'create';
  const initializedRef = useRef(false);

  const {
    // 狀態
    isSaving,
    selectedField,
    draggedFieldType,
    isDragOver,
    isLoading,
    error,
    formData,
    currentTemplate,
    isDirty,
    watchedFields,
    templateData,

    // 操作函數
    handleSave,
    handleRename,
    handleCopyTemplate,
    handleDeleteTemplate,

    // 欄位操作
    handleUpdateField,
    handleDeleteField,
    handleReorderFields,
    handleAddFieldFromType,
    handleFieldSelect,

    // 拖拽操作
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // 欄位拖拽操作
    handleFieldDragStart,
    handleFieldDragEnd,
    handleFieldDrop,

    // 初始化
    initializeTemplate,
  } = useFormTemplateEditController(id);

  const { setCurrentTemplate } = useFormTemplateStore();

  const navigate = useNavigate();

  // 初始化模板數據
  useEffect(() => {
    if (!templateData || initializedRef.current) return;

    initializedRef.current = true;
    initializeTemplate(templateData);
  }, [templateData, initializeTemplate]);

  return (
    <div className='h-full flex flex-col'>
      {/* Topbar */}
      <div className='border-b bg-white px-6 py-4'>
        <div className='flex justify-between items-center'>
          {/* 麵包屑 */}
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Button
              variant='ghost'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (isDirty) {
                  handleSave().then(() => {
                    setCurrentTemplate(null);
                    navigate('/');
                  });
                } else {
                  setCurrentTemplate(null);
                  navigate('/');
                }
              }}
              className='p-0 h-auto text-gray-600 hover:text-gray-900'
            >
              Home
            </Button>
            <ChevronRight className='h-4 w-4' />
            <Button
              variant='ghost'
              onClick={() => {
                if (isDirty) {
                  handleSave().then(() => {
                    setCurrentTemplate(null);
                    navigate('/forms');
                  });
                } else {
                  setCurrentTemplate(null);
                  navigate('/forms');
                }
              }}
              className='p-0 h-auto text-gray-600 hover:text-gray-900'
            >
              表單模板
            </Button>
            <ChevronRight className='h-4 w-4' />
            <FormTemplateTooltip
              content={
                currentTemplate?.name ?? (isEdit ? '編輯模板' : '建立模板')
              }
            >
              <span className='text-gray-900'>
                {truncateText(
                  currentTemplate?.name ?? (isEdit ? '編輯模板' : '建立模板')
                )}
              </span>
            </FormTemplateTooltip>
            {/* 下拉選單 */}
            <FormTemplateActions
              templateName={formData.name}
              onRename={handleRename}
              onCopy={handleCopyTemplate}
              onDelete={handleDeleteTemplate}
              template={{
                id: currentTemplate?.id ?? '',
                name: currentTemplate?.name ?? formData.name,
                fields:
                  currentTemplate?.fields ?? (formData.fields as FormField[]),
                createdAt:
                  currentTemplate?.createdAt ?? new Date().toISOString(),
                updatedAt:
                  currentTemplate?.updatedAt ??
                  formData.updatedAt ??
                  new Date().toISOString(),
              }}
              loading={isSaving}
              icon={<ChevronDown className='h-4 w-4' />}
            />
            {/* 最後編輯時間 */}
            <div className='text-sm text-gray-500'>
              {currentTemplate?.updatedAt && (
                <span>
                  最後編輯:{' '}
                  {new Date(currentTemplate.updatedAt).toLocaleString('zh-TW')}
                </span>
              )}
            </div>
          </div>

          {/* 右側功能區 */}
          <div className='flex items-center gap-4'>
            {/* 完成按鈕 */}
            <Button
              variant='ghost'
              onClick={() => {
                handleSave().then(() => {
                  navigate('/forms');
                });
              }}
              disabled={isSaving}
              className='text-blue-600 hover:text-blue-800'
            >
              <CloudUpload className='h-4 w-4' />
              {isSaving ? '儲存中...' : '完成'}
            </Button>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className='flex-1 flex gap-0 p-0'>
        {/* 錯誤狀態 - 顯示錯誤訊息和返回按鈕 */}
        {error && (
          <div className='h-full flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-lg text-red-600 mb-4'>
                {error?.message || '載入模板失敗'}
              </div>
              <Link to='/forms'>
                <Button variant='outline'>返回列表</Button>
              </Link>
            </div>
          </div>
        )}

        {/* 加載狀態 - 顯示載入中訊息 */}
        {(isLoading || !formData) && (
          <div className='h-full flex items-center justify-center'>
            <div className='text-lg'>載入中...</div>
          </div>
        )}

        {!isLoading && formData && (
          <>
            {/* 第一欄：欄位類型面板 */}
            <FieldBlocksPanel
              fieldTypes={fieldTypes}
              draggedFieldType={draggedFieldType}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onAddField={handleAddFieldFromType}
            />

            {/* 第二欄：表單製作區域 */}
            <FormBuilderArea
              fields={(watchedFields as FormField[]) || []}
              fieldTypes={fieldTypes}
              selectedField={selectedField}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFieldSelect={handleFieldSelect}
              onFieldDelete={handleDeleteField}
              onFieldReorder={handleReorderFields}
              onFieldDragStart={handleFieldDragStart}
              onFieldDragEnd={handleFieldDragEnd}
              onFieldDrop={handleFieldDrop}
            />

            {/* 第三欄：欄位設定（滿版背景）*/}
            <div className='w-96 flex-shrink-0 bg-background-secondary/50 border-l border-border-primary p-4 overflow-y-auto'>
              <h3 className='text-lg font-medium text-text-primary mb-3'>
                欄位設定
              </h3>
              {selectedField ? (
                <FormFieldEditor
                  field={selectedField}
                  onUpdate={handleUpdateField}
                  onDelete={handleDeleteField}
                  onReorder={handleReorderFields}
                  isFirst={
                    formData.fields.findIndex(
                      f => f.id === selectedField.id
                    ) === 0
                  }
                  isLast={
                    formData.fields.findIndex(
                      f => f.id === selectedField.id
                    ) ===
                    formData.fields.length - 1
                  }
                />
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>請選擇一個欄位來編輯設定</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
