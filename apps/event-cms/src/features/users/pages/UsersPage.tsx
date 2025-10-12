import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@nx-playground/ui-components';
import { Plus, Edit, Eye } from 'lucide-react';
import { useState } from 'react';

import { DataTable, type Column } from '../../../components/DataTable';
import { UserEditDialog } from '../components/UserEditDialog';
import { UserDetailDialog } from '../components/UserDetailDialog';
import { UserRoleManager } from '../components/UserRoleManager';
import { mockUsers } from '../mock/userData';
import type { User, UserFormData } from '../types';
import { ROLES, STATUSES } from '../types';

const formatDate = (dateString: string | null) => {
  if (!dateString) return '從未登入';
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Define columns for the DataTable
  const columns: Column<User>[] = [
    {
      key: 'name',
      title: '姓名',
      render: (value, record) => (
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm'>
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
      render: value => {
        const role = value as User['role'];
        return <Badge className={ROLES[role].color}>{ROLES[role].label}</Badge>;
      },
      sortable: true,
    },
    {
      key: 'status',
      title: '狀態',
      render: value => {
        const status = value as User['status'];
        return (
          <Badge className={STATUSES[status].color}>
            {STATUSES[status].label}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      key: 'lastLogin',
      title: '最後登入',
      render: value => (
        <span className='text-sm text-gray-600'>{formatDate(value as string)}</span>
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      title: '註冊時間',
      render: value => (
        <span className='text-sm text-gray-600'>
          {new Date(value as string).toLocaleDateString('zh-TW')}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      title: '操作',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              setSelectedUser(record);
              setIsDetailOpen(true);
            }}
          >
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              setEditingUser(record);
              setIsEditOpen(true);
            }}
          >
            <Edit className='w-4 h-4' />
          </Button>
        </div>
      ),
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    console.log('Export users');
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleSaveUser = (data: UserFormData) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map(u =>
          u.id === editingUser.id
            ? { ...u, ...data }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        ...data,
        id: String(users.length + 1),
        avatar: null,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        permissions: ['events.read'],
      };
      setUsers([...users, newUser]);
    }
    setIsEditOpen(false);
    setEditingUser(null);
  };

  const handleUpdatePermissions = (permissions: string[]) => {
    if (selectedUser) {
      setUsers(
        users.map(u =>
          u.id === selectedUser.id ? { ...u, permissions } : u
        )
      );
      setSelectedUser({ ...selectedUser, permissions });
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsEditOpen(true);
  };

  const handleEditFromDetail = (user: User) => {
    setIsDetailOpen(false);
    setEditingUser(user);
    setIsEditOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>用戶管理</h1>
          <p className='text-gray-600'>管理系統用戶和權限</p>
        </div>
        <Button
          variant='primary'
          className='flex items-center gap-2'
          onClick={handleCreateUser}
        >
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
            data={users}
            columns={columns}
            loading={isLoading}
            searchable={true}
            filterable={true}
            pagination={true}
            pageSize={10}
            onRowClick={handleRowClick}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <UserDetailDialog
        user={selectedUser}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditFromDetail}
      />

      {/* User Edit Dialog */}
      <UserEditDialog
        user={editingUser}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Role Manager (shown when user is selected) */}
      {selectedUser && isDetailOpen && (
        <div className='fixed bottom-8 right-8 w-96 shadow-2xl rounded-lg overflow-hidden'>
          <UserRoleManager
            user={selectedUser}
            onUpdatePermissions={handleUpdatePermissions}
          />
        </div>
      )}
    </div>
  );
}

