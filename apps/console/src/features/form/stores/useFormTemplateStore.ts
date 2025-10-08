import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type FormTemplate } from '../types';

interface FormTemplateStore {
  // 當前選中的模板 ID（用於 UI 狀態）
  selectedTemplateId: string | null;
  // 當前編輯的模板（用於跨頁面狀態）
  currentTemplate: FormTemplate | null;
  // 是否正在創建新模板
  isCreatingNew: boolean;

  // Actions
  setSelectedTemplateId: (id: string | null) => void;
  setCurrentTemplate: (template: FormTemplate | null) => void;
  setIsCreatingNew: (creating: boolean) => void;

  // 清除所有狀態
  clearState: () => void;
}

export const useFormTemplateStore = create<FormTemplateStore>()(
  devtools(
    set => ({
      selectedTemplateId: null,
      currentTemplate: null,
      isCreatingNew: false,

      setSelectedTemplateId: id => set({ selectedTemplateId: id }),
      setCurrentTemplate: template => set({ currentTemplate: template }),
      setIsCreatingNew: creating => set({ isCreatingNew: creating }),

      clearState: () =>
        set({
          selectedTemplateId: null,
          currentTemplate: null,
          isCreatingNew: false,
        }),
    }),
    {
      name: 'form-template-store',
    }
  )
);
