import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@nx-playground/ui-components';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { DataTable, type Column } from '../../components/DataTable';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: '張小明',
    email: 'zhang@example.com',
    role: 'admin',
    status: 'active',
    avatar: null,
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-12-01T09:00:00Z',
  },
  {
    id: '2',
    name: '李小華',
    email: 'li@example.com',
    role: 'user',
    status: 'pending',
    avatar: null,
    lastLogin: null,
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    name: '王大明',
    email: 'wang@example.com',
    role: 'user',
    status: 'active',
    avatar: null,
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2023-11-15T11:30:00Z',
  },
  {
    id: '4',
    name: '陳小美',
    email: 'chen@example.com',
    role: 'moderator',
    status: 'inactive',
    avatar: null,
    lastLogin: '2024-01-05T08:15:00Z',
    createdAt: '2023-10-20T13:45:00Z',
  },
];

const getStatusBadge = (status: string) => {
  const statusMap = {
    active: { label: '活躍', className: 'bg-green-100 text-green-800' },
    pending: { label: '待審核', className: 'bg-yellow-100 text-yellow-800' },
    inactive: { label: '停用', className: 'bg-gray-100 text-gray-800' },
  };

  const statusInfo =
    statusMap[status as keyof typeof statusMap] || statusMap.inactive;

  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

const getRoleBadge = (role: string) => {
  const roleMap = {
    admin: { label: '管理員', className: 'bg-red-100 text-red-800' },
    moderator: { label: '版主', className: 'bg-blue-100 text-blue-800' },
    user: { label: '用戶', className: 'bg-gray-100 text-gray-800' },
  };

  const roleInfo = roleMap[role as keyof typeof roleMap] || roleMap.user;

  return <Badge className={roleInfo.className}>{roleInfo.label}</Badge>;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '從未登入';

  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Define columns for the DataTable
const columns: Column<(typeof mockUsers)[0]>[] = [
  {
    key: 'name',
    title: '姓名',
    render: (value, record) => (
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm'>
          {record.name.charAt(0)}
        </div>
        <div>
          <div className='font-medium text-gray-900'>{record.name}</div>
          <div className='text-sm text-gray-500'>{record.email}</div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'role',
    title: '角色',
    render: value => getRoleBadge(value),
    sortable: true,
  },
  {
    key: 'status',
    title: '狀態',
    render: value => getStatusBadge(value),
    sortable: true,
  },
  {
    key: 'lastLogin',
    title: '最後登入',
    render: value => (
      <span className='text-sm text-gray-600'>{formatDate(value)}</span>
    ),
    sortable: true,
  },
  {
    key: 'createdAt',
    title: '註冊時間',
    render: value => (
      <span className='text-sm text-gray-600'>
        {new Date(value).toLocaleDateString('zh-TW')}
      </span>
    ),
    sortable: true,
  },
];

export const Users: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Simulate export functionality
    // TODO: Implement actual export functionality
  };

  const handleRowClick = (user: (typeof mockUsers)[0]) => {
    // TODO: Navigate to user detail page or open user modal
    // eslint-disable-next-line no-console
    console.log('User clicked:', user);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>用戶管理</h1>
          <p className='text-gray-600'>管理系統用戶和權限</p>
        </div>
        <Button variant='primary' className='flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          新增用戶
        </Button>
      </div>

      {/* Users DataTable */}
      <Card>
        <CardHeader>
          <CardTitle>用戶列表</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockUsers}
            columns={columns}
            loading={isLoading}
            searchable={true}
            filterable={true}
            pagination={true}
            pageSize={5}
            onRowClick={handleRowClick}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </CardContent>
      </Card>
    </div>
  );
};
