import type { RegistrationForm } from '@/types';

// Mock 報名表數據
export const mockRegistrationForms: RegistrationForm[] = [
  // order-001 的報名表 (現場付款已付款，已出票)
  {
    id: 'order-001-form-1',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-001',
    orderItemId: 'order-item-001-1',
    ticketId: 'order-001-ticket-1',
    status: 'completed',
    submittedAt: '2024-02-15T10:35:00Z',
    formData: {
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912345678',
    },
  },
  {
    id: 'order-001-form-2',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-001',
    orderItemId: 'order-item-001-1',
    ticketId: 'order-001-ticket-2',
    status: 'completed',
    submittedAt: '2024-02-15T10:36:00Z',
    formData: {
      name: '李小華',
      email: 'li@example.com',
      phone: '0987654321',
    },
  },
  // order-005 的報名表 (ATM轉帳完成出票中，報名表已填寫但票券還未出)
  {
    id: 'order-005-form-1',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-005',
    orderItemId: 'order-item-005-1',
    // ticketId: 'order-005-ticket-1', // 出票中時還沒有 ticketId
    status: 'completed',
    submittedAt: '2024-02-11T11:35:00Z',
    formData: {
      name: '陳小美',
      email: 'chen@example.com',
      phone: '0934567890',
    },
  },
  // order-006 的報名表 (ATM轉帳已付款且已出票)
  {
    id: 'order-006-form-1',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-006',
    orderItemId: 'order-item-006-1',
    ticketId: 'order-006-ticket-1',
    status: 'completed',
    submittedAt: '2024-02-10T08:25:00Z',
    formData: {
      name: '張小強',
      email: 'zhang@example.com',
      phone: '0945678901',
    },
  },
  {
    id: 'order-006-form-2',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-006',
    orderItemId: 'order-item-006-1',
    ticketId: 'order-006-ticket-2',
    status: 'completed',
    submittedAt: '2024-02-10T08:26:00Z',
    formData: {
      name: '林小芳',
      email: 'lin@example.com',
      phone: '0956789012',
    },
  },
  {
    id: 'order-006-form-3',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-006',
    orderItemId: 'order-item-006-1',
    ticketId: 'order-006-ticket-3',
    status: 'completed',
    submittedAt: '2024-02-10T08:27:00Z',
    formData: {
      name: '黃小偉',
      email: 'huang@example.com',
      phone: '0967890123',
    },
  },
  {
    id: 'order-006-form-4',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-006',
    orderItemId: 'order-item-006-1',
    ticketId: 'order-006-ticket-4',
    status: 'completed',
    submittedAt: '2024-02-10T08:28:00Z',
    formData: {
      name: '吳小玲',
      email: 'wu@example.com',
      phone: '0978901234',
    },
  },
  // order-007 的報名表 (現場付款完成出票中，報名表已填寫)
  {
    id: 'order-007-form-1',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-007',
    orderItemId: 'order-item-007-1',
    // ticketId: 'order-007-ticket-1', // 出票中時還沒有 ticketId
    status: 'completed',
    submittedAt: '2024-02-16T09:18:00Z',
    formData: {
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912345678',
    },
  },
  {
    id: 'order-007-form-2',
    templateId: 'default-template',
    templateName: '標準報名表',
    orderId: 'order-007',
    orderItemId: 'order-item-007-2',
    // ticketId: 'order-007-ticket-2', // 出票中時還沒有 ticketId
    status: 'completed',
    submittedAt: '2024-02-16T09:19:00Z',
    formData: {
      name: '王小美',
      email: 'wangmei@example.com',
      phone: '0923456789',
    },
  },
];
