import { create } from 'zustand';

import { type PreferPaymentItem } from './mock/mockAPI';
import { EditingBlockEnum, type FormBlockType, NavigateEnum } from './types';

type NavigateStore = {
  navigate: NavigateEnum;
  setNavigate: (newNavigate: NavigateEnum) => void;
};
export const useNavigateStore = create<NavigateStore>(set => ({
  navigate: NavigateEnum.event,
  setNavigate: newNavigate => set({ navigate: newNavigate }),
}));

type EventCreateStore = {
  editingBlock: EditingBlockEnum;
  setEditingBlock: (newEditingBlock: EditingBlockEnum) => void;
};

export const useEventStore = create<EventCreateStore>(set => ({
  editingBlock: EditingBlockEnum.Others,
  setEditingBlock: newEditingBlock => set({ editingBlock: newEditingBlock }),
}));

type SessionCreateStore = {
  editingSessionId: string | null; // 用來判斷是否正在編輯狀態 以及 取得資料用(id)的變數
  setEditingSessionId: (newSessionId: string | null) => void;
  hasError: boolean;
  setHasError: (newState: boolean) => void;
  hasSession: boolean;
  setHasSession: (newState: boolean) => void;
};

export const useSessionStore = create<SessionCreateStore>(set => ({
  editingSessionId: null,
  setEditingSessionId: newSessionId => set({ editingSessionId: newSessionId }),

  hasError: false,
  setHasError: newState => set({ hasError: newState }),

  hasSession: false,
  setHasSession: newState => set({ hasSession: newState }),
}));

type TicketCreateStore = {
  editingTicketId: string | null; // 用來判斷是否正在編輯狀態 以及 取得資料用(id)的變數
  setEditingTicketId: (newEditingTicket: string | null) => void;
  hasError: boolean;
  setHasError: (newState: boolean) => void;
  hasTicket: boolean;
  setHasTicket: (newState: boolean) => void;
};

export const useTicketStore = create<TicketCreateStore>(set => ({
  editingTicketId: null,
  setEditingTicketId: newEditingTicket =>
    set({ editingTicketId: newEditingTicket }),

  hasError: false,
  setHasError: newState => set({ hasError: newState }),

  hasTicket: false,
  setHasTicket: newState => set({ hasTicket: newState }),
}));

type FormCreateStore = {
  editingFormId: string | null; // 用來判斷是否正在編輯狀態 以及 取得資料用(id)的變數
  setEditingFormId: (newFormId: string | null) => void;
  hasError: boolean;
  setHasError: (newState: boolean) => void;
  hasForm: boolean;
  setHasForm: (newState: boolean) => void;
  toggleAreaIndex: number;
  setToggleAreaIndex: (newIndex: number) => void;
  openSaveTemplate: boolean;
  setOpenSaveTemplate: (newState: boolean) => void;
  openApplyTemplate: boolean;
  setOpenApplyTemplate: (newState: boolean) => void;
  template: Array<FormBlockType>;
  setTemplate: (newTemplate: Array<FormBlockType>) => void;
};

export const useFormStore = create<FormCreateStore>(set => ({
  editingFormId: null,
  setEditingFormId: newFormId => set({ editingFormId: newFormId }),

  toggleAreaIndex: -1,
  setToggleAreaIndex: newIndex => set({ toggleAreaIndex: newIndex }),

  hasError: false,
  setHasError: newState => set({ hasError: newState }),

  hasForm: false,
  setHasForm: newState => set({ hasForm: newState }),

  openSaveTemplate: false,
  setOpenSaveTemplate: newState => set({ openSaveTemplate: newState }),

  openApplyTemplate: false,
  setOpenApplyTemplate: newState => set({ openApplyTemplate: newState }),

  template: [],
  setTemplate: newTemplate => set({ template: newTemplate }),
}));

type PreviewCreateStore = {
  editingDescriptionType: string;
  setEditingDescriptionType: (newType: string) => void;
  editingPaymentType: string;
  setEditingPaymentType: (newType: string) => void;
  hasError: boolean;
  setHasError: (newState: boolean) => void;

  openPreferAccount: boolean;
  setOpenPreferAccount: (newState: boolean) => void;
  preferPayment: PreferPaymentItem[];
  setPreferPayment: (newPreferPayment: PreferPaymentItem[]) => void;
};

export const usePreviewStore = create<PreviewCreateStore>(set => ({
  editingDescriptionType: 'null',
  setEditingDescriptionType: newType =>
    set({ editingDescriptionType: newType }),
  editingPaymentType: 'null',
  setEditingPaymentType: newType => set({ editingPaymentType: newType }),

  hasError: false,
  setHasError: newState => set({ hasError: newState }),

  openPreferAccount: false,
  setOpenPreferAccount: newState => set({ openPreferAccount: newState }),
  preferPayment: [],
  setPreferPayment: newPreferPayment =>
    set({ preferPayment: newPreferPayment }),
}));
