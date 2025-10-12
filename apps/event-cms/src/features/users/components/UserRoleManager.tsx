import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@nx-playground/ui-components';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '../types';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const PERMISSIONS: Permission[] = [
  {
    id: 'users.read',
    name: '查看用戶',
    description: '可以查看用戶列表和詳情',
    category: '用戶管理',
  },
  {
    id: 'users.write',
    name: '編輯用戶',
    description: '可以創建、編輯和刪除用戶',
    category: '用戶管理',
  },
  {
    id: 'events.read',
    name: '查看活動',
    description: '可以查看所有活動',
    category: '活動管理',
  },
  {
    id: 'events.write',
    name: '管理活動',
    description: '可以創建、編輯和刪除活動',
    category: '活動管理',
  },
  {
    id: 'events.register',
    name: '報名活動',
    description: '可以報名參加活動',
    category: '活動管理',
  },
  {
    id: 'events.moderate',
    name: '審核活動',
    description: '可以審核和發布活動',
    category: '活動管理',
  },
  {
    id: 'forms.read',
    name: '查看表單',
    description: '可以查看表單模板',
    category: '表單管理',
  },
  {
    id: 'forms.write',
    name: '管理表單',
    description: '可以創建和編輯表單模板',
    category: '表單管理',
  },
  {
    id: 'settings.read',
    name: '查看設定',
    description: '可以查看系統設定',
    category: '系統設定',
  },
  {
    id: 'settings.write',
    name: '管理設定',
    description: '可以修改系統設定',
    category: '系統設定',
  },
];

interface UserRoleManagerProps {
  user: User;
  onUpdatePermissions: (permissions: string[]) => void;
}

export function UserRoleManager({ user, onUpdatePermissions }: UserRoleManagerProps) {
  const userPermissions = user.permissions || [];

  const hasPermission = (permissionId: string) => {
    return userPermissions.includes(permissionId);
  };

  const togglePermission = (permissionId: string) => {
    const newPermissions = hasPermission(permissionId)
      ? userPermissions.filter(p => p !== permissionId)
      : [...userPermissions, permissionId];
    onUpdatePermissions(newPermissions);
  };

  // Group permissions by category
  const groupedPermissions = PERMISSIONS.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='w-5 h-5' />
          權限管理
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Role Badge */}
          <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
            <div className='flex-1'>
              <p className='text-sm text-gray-600 mb-1'>當前角色</p>
              <Badge className='text-base px-3 py-1'>
                {user.role === 'admin' && '管理員'}
                {user.role === 'moderator' && '版主'}
                {user.role === 'user' && '一般用戶'}
              </Badge>
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-gray-900'>
                {userPermissions.length}
              </p>
              <p className='text-xs text-gray-600'>個權限</p>
            </div>
          </div>

          {/* Permissions by category */}
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category}>
              <h4 className='font-semibold text-gray-900 mb-3'>{category}</h4>
              <div className='space-y-2'>
                {permissions.map(permission => {
                  const enabled = hasPermission(permission.id);
                  return (
                    <div
                      key={permission.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        enabled
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className='flex items-start gap-3 flex-1'>
                        {enabled ? (
                          <CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
                        ) : (
                          <XCircle className='w-5 h-5 text-gray-400 mt-0.5' />
                        )}
                        <div>
                          <p className='font-medium text-gray-900'>
                            {permission.name}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {permission.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={enabled ? 'outline' : 'primary'}
                        size='sm'
                        onClick={() => togglePermission(permission.id)}
                      >
                        {enabled ? '移除' : '授予'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Info Note */}
          <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
            <p className='text-sm text-blue-700'>
              💡 <strong>提示</strong>: 權限變更會立即生效。請謹慎授予管理權限。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

