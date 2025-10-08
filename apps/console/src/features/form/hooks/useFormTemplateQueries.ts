import { useToast } from '@nx-playground/ui-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getFormTemplates,
  getFormTemplate,
  createFormTemplate,
  copyFormTemplate,
  deleteFormTemplate,
  renameFormTemplate,
} from '../services/formTemplateService';
import { type FormTemplate, type FormTemplateListItem } from '../types';

// Query Keys
export const formTemplateKeys = {
  all: ['formTemplates'] as const,
  lists: () => [...formTemplateKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...formTemplateKeys.lists(), { filters }] as const,
  details: () => [...formTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...formTemplateKeys.details(), id] as const,
};

// Queries
export const useFormTemplatesQuery = () => {
  return useQuery({
    queryKey: formTemplateKeys.lists(),
    queryFn: getFormTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFormTemplateQuery = (id: string) => {
  return useQuery({
    queryKey: formTemplateKeys.detail(id),
    queryFn: () => getFormTemplate(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateFormTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createFormTemplate,
    onSuccess: newTemplate => {
      // 更新列表緩存
      queryClient.setQueryData<FormTemplateListItem[]>(
        formTemplateKeys.lists(),
        oldData => {
          if (!oldData) return [newTemplate];
          return [newTemplate, ...oldData];
        }
      );

      addToast({
        message: '模板已創建',
        type: 'success',
      });
    },
    onError: _error => {
      addToast({
        message: '創建模板失敗',
        type: 'error',
      });
    },
  });
};

export const useCopyFormTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({
      templateId,
      copyName,
    }: {
      templateId: string;
      copyName: string;
    }) => copyFormTemplate(templateId, copyName),
    onSuccess: newTemplate => {
      // 更新列表緩存
      queryClient.setQueryData<FormTemplateListItem[]>(
        formTemplateKeys.lists(),
        oldData => {
          if (!oldData) return [newTemplate];
          return [newTemplate, ...oldData];
        }
      );

      addToast({
        message: '模板已複製',
        type: 'success',
      });
    },
    onError: _error => {
      addToast({
        message: '複製模板失敗',
        type: 'error',
      });
    },
  });
};

export const useRenameFormTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({
      templateId,
      newName,
    }: {
      templateId: string;
      newName: string;
    }) => renameFormTemplate(templateId, newName),
    onSuccess: (updatedTemplate, variables) => {
      // 方法1: 手動更新 cache
      queryClient.setQueryData<FormTemplateListItem[]>(
        formTemplateKeys.lists(),
        oldData => {
          if (!oldData) return [];
          return oldData.map(template =>
            template.id === variables.templateId
              ? {
                  ...template,
                  name: updatedTemplate.name,
                  updatedAt: updatedTemplate.updatedAt,
                }
              : template
          );
        }
      );

      // 方法2: 同時使用 invalidateQueries 作為備用
      queryClient.invalidateQueries({
        queryKey: formTemplateKeys.lists(),
      });

      // 更新詳情緩存
      queryClient.setQueryData<FormTemplate>(
        formTemplateKeys.detail(variables.templateId),
        updatedTemplate
      );

      addToast({
        message: '模板名稱已更新',
        type: 'success',
      });
    },
    onError: _error => {
      addToast({
        message: '更新模板名稱失敗',
        type: 'error',
      });
    },
  });
};

export const useDeleteFormTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: deleteFormTemplate,
    onSuccess: (_, templateId) => {
      // 從列表緩存中移除
      queryClient.setQueryData<FormTemplateListItem[]>(
        formTemplateKeys.lists(),
        oldData => {
          if (!oldData) return [];
          return oldData.filter(template => template.id !== templateId);
        }
      );

      // 移除詳情緩存
      queryClient.removeQueries({
        queryKey: formTemplateKeys.detail(templateId),
      });

      addToast({
        message: '模板已刪除',
        type: 'success',
      });
    },
    onError: _error => {
      addToast({
        message: '刪除模板失敗',
        type: 'error',
      });
    },
  });
};
