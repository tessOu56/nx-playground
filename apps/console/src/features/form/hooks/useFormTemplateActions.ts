import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormTemplateStore } from '../stores/useFormTemplateStore';
import { type FormTemplateListItem } from '../types';

import { useCopyCount } from './useCopyCount';
import {
  useCreateFormTemplateMutation,
  useCopyFormTemplateMutation,
  useDeleteFormTemplateMutation,
  useRenameFormTemplateMutation,
} from './useFormTemplateQueries';

export const useFormTemplateActions = () => {
  const navigate = useNavigate();
  const { generateCopyName } = useCopyCount();
  const { setSelectedTemplateId, setCurrentTemplate } = useFormTemplateStore();

  // React Query mutations
  const createMutation = useCreateFormTemplateMutation();
  const copyMutation = useCopyFormTemplateMutation();
  const renameMutation = useRenameFormTemplateMutation();
  const deleteMutation = useDeleteFormTemplateMutation();

  const handleCopyTemplate = useCallback(
    async (template: FormTemplateListItem) => {
      const copyName = generateCopyName(template.name);
      const newTemplate = await copyMutation.mutateAsync({
        templateId: template.id,
        copyName,
      });

      // 設置新模板為當前選中
      setSelectedTemplateId(newTemplate.id);
      setCurrentTemplate(newTemplate);

      // 導航到編輯頁面
      navigate(`/forms/edit/${newTemplate.id}`);
    },
    [
      copyMutation,
      generateCopyName,
      setSelectedTemplateId,
      setCurrentTemplate,
      navigate,
    ]
  );

  const handleDeleteTemplate = useCallback(
    async (template: FormTemplateListItem) => {
      await deleteMutation.mutateAsync(template.id);

      // 清除選中狀態
      setSelectedTemplateId(null);
      setCurrentTemplate(null);
    },
    [deleteMutation, setSelectedTemplateId, setCurrentTemplate]
  );

  const handleRenameTemplate = useCallback(
    async (template: FormTemplateListItem, newName: string) => {
      const updatedTemplate = await renameMutation.mutateAsync({
        templateId: template.id,
        newName,
      });

      // 如果當前選中的是這個模板，更新當前模板
      const { selectedTemplateId } = useFormTemplateStore.getState();
      if (selectedTemplateId === template.id) {
        setCurrentTemplate(updatedTemplate);
      }
    },
    [renameMutation, setCurrentTemplate]
  );

  const handleCreateTemplate = useCallback(
    async (name: string) => {
      const newTemplate = await createMutation.mutateAsync(name);

      // 設置新模板為當前選中
      setSelectedTemplateId(newTemplate.id);
      setCurrentTemplate(newTemplate);

      // 導航到編輯頁面
      navigate(`/forms/edit/${newTemplate.id}`);
    },
    [createMutation, setSelectedTemplateId, setCurrentTemplate, navigate]
  );

  const handleTemplateClick = useCallback(
    (template: FormTemplateListItem) => {
      setSelectedTemplateId(template.id);
      setCurrentTemplate(template);
    },
    [setSelectedTemplateId, setCurrentTemplate]
  );

  // 檢查是否可以創建新模板（基於當前數據）
  const canCreateNew = useCallback(() => {
    // 這個邏輯可以根據實際需求調整
    // 目前假設沒有數量限制
    return true;
  }, []);

  return {
    handleCopyTemplate,
    handleDeleteTemplate,
    handleRenameTemplate,
    handleCreateTemplate,
    handleTemplateClick,
    canCreateNew,
  };
};
