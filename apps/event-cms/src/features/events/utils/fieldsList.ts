import { EventFormFieldType as FormFieldType } from '../types';

export const questionField: EventFormFieldType[] = [
  {
    id: '1',
    fieldType: 'radio', // 單選
    label: '單選',
    description: '',
    noteContent: '',
    isRequired: false,
    options: ['選項A', '選項B'],
    hint: '',
  },
  {
    id: '2',
    fieldType: 'checkbox', // 多選
    label: '多選',
    description: '',
    noteContent: '',
    isRequired: false,
    options: ['選項A', '選項B'],
    hint: '',
  },
  {
    id: '3',
    fieldType: 'select', // 下拉選單
    label: '下拉選單',
    description: '',
    noteContent: '',
    isRequired: false,
    options: ['選項A', '選項B'],
    hint: '',
  },
  {
    id: '4',
    fieldType: 'text', // 單行文字
    label: '單行文字',
    description: '',
    noteContent: '',
    isRequired: true,
    hint: '請輸入文字',
  },
  {
    id: '5',
    fieldType: 'textarea', // 多行文字
    label: '多行文字',
    description: '',
    noteContent: '',
    isRequired: false,
    hint: '請輸入文字',
  },
  {
    id: '6',
    fieldType: 'date', // 日期
    label: '日期',
    description: '',
    noteContent: '',
    isRequired: false,
    hint: '請輸入日期',
  },
];

export const descriptionField: EventFormFieldType[] = [
  {
    id: '7',
    fieldType: 'description',
    label: '備註說明',
    description: '',
    noteContent: '編輯備註文字，請輸入如活動注意事項等內容',
    isRequired: true,
    hint: '',
  },
];
