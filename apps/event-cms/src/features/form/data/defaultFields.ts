import { type FormField } from '../types';

// 預設欄位列表 - 常用欄位，可以快速新增到表單中
export const defaultFields: Omit<FormField, 'id' | 'order'>[] = [
  {
    type: 'text',
    label: '姓名',
    placeholder: '請輸入您的姓名',
    validation: {
      required: true,
      message: '姓名為必填欄位',
    },
  },
  {
    type: 'email',
    label: '電子郵件',
    placeholder: '請輸入您的電子郵件',
    validation: {
      required: true,
      message: '電子郵件為必填欄位',
    },
  },
  {
    type: 'tel',
    label: '電話號碼',
    placeholder: '請輸入您的電話號碼',
    validation: {
      required: false,
    },
  },
  {
    type: 'text',
    label: '公司名稱',
    placeholder: '請輸入您的公司名稱',
    validation: {
      required: false,
    },
  },
  {
    type: 'textarea',
    label: '留言內容',
    placeholder: '請輸入您的留言內容',
    validation: {
      required: true,
      message: '留言內容為必填欄位',
    },
  },
  {
    type: 'select',
    label: '聯絡方式偏好',
    placeholder: '請選擇偏好的聯絡方式',
    options: ['電話', '電子郵件', '簡訊', '其他'],
    validation: {
      required: false,
    },
  },
  {
    type: 'radio',
    label: '性別',
    options: ['男性', '女性', '其他'],
    validation: {
      required: false,
    },
  },
  {
    type: 'checkbox',
    label: '同意條款',
    validation: {
      required: true,
      message: '請同意相關條款',
    },
  },
  {
    type: 'date',
    label: '出生日期',
    validation: {
      required: false,
    },
  },
  {
    type: 'number',
    label: '年齡',
    placeholder: '請輸入您的年齡',
    validation: {
      required: false,
      min: 0,
      max: 120,
      message: '年齡必須在 0-120 之間',
    },
  },
];
