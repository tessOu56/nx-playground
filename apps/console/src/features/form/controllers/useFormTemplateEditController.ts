import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@nx-playground/ui-components';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useFormTemplateActions } from '../hooks/useFormTemplateActions';
import {
  useFormTemplateQuery,
  useRenameFormTemplateMutation,
} from '../hooks/useFormTemplateQueries';
import {
  formTemplateSchema,
  type FormTemplateFormData,
} from '../schemas/formTemplate.schema';
import { useFormTemplateStore } from '../stores/useFormTemplateStore';
import {
  type FormTemplate,
  type FormTemplateListItem,
  type FormField,
  type FormFieldType,
} from '../types';

export const useFormTemplateEditController = (templateId?: string) => {
  const { addToast } = useToast();

  // Store 狀態
  const { setCurrentTemplate, currentTemplate } = useFormTemplateStore();

  // React Query 數據獲取
  const {
    data: templateData,
    isLoading,
    error,
  } = useFormTemplateQuery(templateId ?? '');

  // Actions
  const { handleCopyTemplate, handleDeleteTemplate } = useFormTemplateActions();

  // React Query mutations
  const renameMutation = useRenameFormTemplateMutation();

  // 本地狀態
  const [isSaving, setIsSaving] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<FormField | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 表單控制
  const {
    watch,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isDirty },
  } = useForm<FormTemplateFormData>({
    resolver: zodResolver(formTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      fields: [],
      submitText: '送出',
    },
  });

  const formData = watch();
  const watchedFields = watch('fields');

  // 初始化模板數據
  const initializeTemplate = useCallback(
    (template: FormTemplate) => {
      reset({
        name: template.name,
        description: '',
        fields: template.fields,
        submitText: template.submitText ?? '送出',
        updatedAt: template.updatedAt,
      });
    },
    [reset]
  );

  // 手動儲存
  const handleSave = useCallback(async () => {
    if (!formData.name || !templateData) return;

    setIsSaving(true);
    try {
      const updatedTemplate: FormTemplate = {
        id: templateData.id,
        name: formData.name,
        fields: formData.fields as FormField[],
        submitText: formData.submitText,
        createdAt: templateData.createdAt,
        updatedAt: new Date().toISOString(),
      };
      setCurrentTemplate(updatedTemplate);
      addToast({
        message: '模板已儲存',
        type: 'success',
      });
    } catch (_saveError) {
      addToast({
        message: '儲存模板失敗',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, templateData, setCurrentTemplate, addToast]);

  // 重新命名
  const handleRename = useCallback(
    async (template: FormTemplateListItem, newName: string) => {
      // 使用 React Query mutation 更新後端數據和緩存
      await renameMutation.mutateAsync({
        templateId: template.id,
        newName,
      });

      // 更新表單中的名稱
      setValue('name', newName);

      // 更新當前模板
      setCurrentTemplate({
        ...template,
        name: newName,
        updatedAt: new Date().toISOString(),
      });
    },
    [renameMutation, setValue, setCurrentTemplate]
  );

  // 欄位操作
  const handleUpdateField = useCallback(
    (fieldId: string, updatedField: FormField) => {
      const currentFields = getValues('fields');
      const updatedFields = currentFields.map(field =>
        field.id === fieldId ? updatedField : field
      );
      setValue('fields', updatedFields);
    },
    [getValues, setValue]
  );

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      const currentFields = getValues('fields');
      const updatedFields = currentFields.filter(field => field.id !== fieldId);
      setValue('fields', updatedFields);
      if (selectedField?.id === fieldId) {
        setSelectedField(null);
      }
    },
    [getValues, setValue, selectedField]
  );

  const handleReorderFields = useCallback(
    (fieldId: string, direction: 'up' | 'down') => {
      const currentFields = getValues('fields');
      const fields = [...currentFields];
      const index = fields.findIndex(field => field.id === fieldId);

      if (direction === 'up' && index > 0) {
        [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
      } else if (direction === 'down' && index < fields.length - 1) {
        [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
      }

      const updatedFields = fields.map((field, idx) => ({
        ...field,
        order: idx + 1,
      }));
      setValue('fields', updatedFields);
    },
    [getValues, setValue]
  );

  const handleAddFieldFromType = useCallback(
    (fieldType: string, position?: number) => {
      const currentFields = getValues('fields');
      const newField: FormField = {
        id: `field_${Date.now()}`,
        type: fieldType as FormFieldType,
        label: '新欄位',
        placeholder: '請輸入...',
        validation: { required: false },
        order: position !== undefined ? position + 1 : currentFields.length + 1,
      };

      let updatedFields: FormField[];
      if (position !== undefined) {
        // Insert at specific position
        updatedFields = [...(currentFields as FormField[])];
        updatedFields.splice(position, 0, newField);
        // Update order for all fields after the insertion point
        updatedFields = updatedFields.map((field, idx) => ({
          ...field,
          order: idx + 1,
        }));
      } else {
        // Add to the end
        updatedFields = [...(currentFields as FormField[]), newField];
      }

      setValue('fields', updatedFields, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger('fields');
      setSelectedField(newField);
    },
    [getValues, setValue]
  );

  // 拖拽相關
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, fieldType: string) => {
      setDraggedFieldType(fieldType);
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/plain', fieldType);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedFieldType(null);
    setDraggedField(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, position?: number) => {
      e.preventDefault();
      setIsDragOver(false);

      const fieldType = e.dataTransfer.getData('text/plain');
      if (fieldType) {
        handleAddFieldFromType(fieldType, position);
      }
    },
    [handleAddFieldFromType]
  );

  const handleFieldSelect = useCallback((field: FormField) => {
    setSelectedField(field);
  }, []);

  // 欄位拖拽相關
  const handleFieldDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, field: FormField) => {
      setDraggedField(field);
      e.dataTransfer.setData('field-id', field.id);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleFieldDragEnd = useCallback(() => {
    setDraggedField(null);
  }, []);

  const handleFieldDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetPosition: number) => {
      e.preventDefault();
      const draggedFieldId = e.dataTransfer.getData('field-id');
      if (!draggedFieldId || !draggedField) return;

      const currentFields = getValues('fields');
      const draggedIndex = currentFields.findIndex(
        field => field.id === draggedFieldId
      );

      if (draggedIndex === -1) return;

      // 如果拖拽到相同位置，不做任何操作
      if (draggedIndex === targetPosition) return;

      const updatedFields = [...(currentFields as FormField[])];
      const [movedField] = updatedFields.splice(draggedIndex, 1);

      // 調整目標位置（如果拖拽的欄位在目標位置之前，需要減1）
      const adjustedTargetPosition =
        draggedIndex < targetPosition ? targetPosition - 1 : targetPosition;
      updatedFields.splice(adjustedTargetPosition, 0, movedField);

      // 更新 order
      const reorderedFields = updatedFields.map((field, idx) => ({
        ...field,
        order: idx + 1,
      }));

      setValue('fields', reorderedFields, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger('fields');
      setDraggedField(null);
    },
    [draggedField, getValues, setValue, trigger]
  );

  return {
    // 狀態
    isSaving,
    selectedField,
    draggedFieldType,
    isDragOver,
    isLoading,
    error,
    formData,
    watchedFields,
    currentTemplate,
    templateData,
    errors,
    isDirty,

    // 表單控制
    watch,
    setValue,
    getValues,
    reset,

    // 操作函數
    handleSave,
    handleRename,
    handleCopyTemplate,
    handleDeleteTemplate,
    initializeTemplate,

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
  };
};
