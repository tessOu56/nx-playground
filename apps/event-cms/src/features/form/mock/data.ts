import {
  type FormTemplate,
  type FormTemplateListItem,
  type FieldType,
} from '../types';

// 模擬數據存儲
export const mockTemplates: FormTemplateListItem[] = [
  {
    id: '1',
    name: '客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: '姓名',
        placeholder: '請輸入姓名',
        validation: { required: true },
        order: 1,
      },
      {
        id: 'email',
        type: 'email',
        label: '電子郵件',
        placeholder: '請輸入電子郵件',
        validation: { required: true },
        order: 2,
      },
      {
        id: 'phone',
        type: 'tel',
        label: '電話號碼',
        placeholder: '請輸入電話號碼',
        validation: { required: false },
        order: 3,
      },
      {
        id: 'message',
        type: 'textarea',
        label: '訊息',
        placeholder: '請輸入訊息內容',
        validation: { required: false },
        order: 4,
      },
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  {
    id: '2',
    name: '活動報名表',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: '姓名',
        placeholder: '請輸入姓名',
        validation: { required: true },
        order: 1,
      },
      {
        id: 'email',
        type: 'email',
        label: '電子郵件',
        placeholder: '請輸入電子郵件',
        validation: { required: true },
        order: 2,
      },
    ],
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
  },
  {
    id: '3',
    name: '意見回饋表單',
    fields: [],
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
  },
];

export const mockTemplateDetails: Record<string, FormTemplate> = {
  '1': {
    id: '1',
    name: '客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超長模板名稱測試客戶聯絡表單之超',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: '姓名',
        placeholder: '請輸入姓名',
        validation: { required: true },
        order: 1,
      },
      {
        id: 'email',
        type: 'email',
        label: '電子郵件',
        placeholder: '請輸入電子郵件',
        validation: { required: true },
        order: 2,
      },
      {
        id: 'phone',
        type: 'tel',
        label: '電話號碼',
        placeholder: '請輸入電話號碼',
        validation: { required: false },
        order: 3,
      },
      {
        id: 'message',
        type: 'textarea',
        label: '訊息',
        placeholder: '請輸入訊息內容',
        validation: { required: false },
        order: 4,
      },
    ],
    submitText: '送出',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  '2': {
    id: '2',
    name: '活動報名表',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: '姓名',
        placeholder: '請輸入姓名',
        validation: { required: true },
        order: 1,
      },
      {
        id: 'email',
        type: 'email',
        label: '電子郵件',
        placeholder: '請輸入電子郵件',
        validation: { required: true },
        order: 2,
      },
    ],
    submitText: '報名',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
  },
  '3': {
    id: '3',
    name: '意見回饋表單',
    fields: [],
    submitText: '送出',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
  },
};

// 可用的欄位類型
export const fieldTypes: FieldType[] = [
  {
    id: 'text',
    name: '文字輸入',
    description: '單行文字輸入框',
    icon: '📝',
  },
  {
    id: 'textarea',
    name: '多行文字',
    description: '多行文字輸入框',
    icon: '📄',
  },
  {
    id: 'email',
    name: '電子郵件',
    description: '電子郵件輸入框',
    icon: '📧',
  },
  {
    id: 'tel',
    name: '電話號碼',
    description: '電話號碼輸入框',
    icon: '📞',
  },
  {
    id: 'number',
    name: '數字',
    description: '數字輸入框',
    icon: '🔢',
  },
  {
    id: 'date',
    name: '日期',
    description: '日期選擇器',
    icon: '📅',
  },
];
