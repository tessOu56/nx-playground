import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@nx-playground/ui-components';
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  User as UserIcon,
} from 'lucide-react';

import type { User } from '../types';
import { ROLES, STATUSES } from '../types';

interface UserDetailDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: User) => void;
}

export function UserDetailDialog({
  user,
  isOpen,
  onClose,
  onEdit,
}: UserDetailDialogProps) {
  if (!user) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl'>
                {user.name.charAt(0)}
              </div>
              <div>
                <DialogTitle className='text-2xl'>{user.name}</DialogTitle>
                <div className='flex gap-2 mt-2'>
                  <Badge className={ROLES[user.role].color}>
                    {ROLES[user.role].label}
                  </Badge>
                  <Badge className={STATUSES[user.status].color}>
                    {STATUSES[user.status].label}
                  </Badge>
                </div>
              </div>
            </div>
            {onEdit && (
              <Button variant='outline' size='sm' onClick={() => onEdit(user)}>
                編輯
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue='info' className='mt-6'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='info'>基本資訊</TabsTrigger>
            <TabsTrigger value='permissions'>權限設定</TabsTrigger>
            <TabsTrigger value='activity'>活動記錄</TabsTrigger>
          </TabsList>

          <TabsContent value='info' className='space-y-4 mt-4'>
            {/* 聯絡資訊 */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Mail className='w-4 h-4' />
                  <span className='text-sm font-medium'>Email</span>
                </div>
                <p className='text-gray-900'>{user.email}</p>
              </div>

              {user.phone && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Phone className='w-4 h-4' />
                    <span className='text-sm font-medium'>電話</span>
                  </div>
                  <p className='text-gray-900'>{user.phone}</p>
                </div>
              )}

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-sm font-medium'>註冊時間</span>
                </div>
                <p className='text-gray-900'>{formatDate(user.createdAt)}</p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Clock className='w-4 h-4' />
                  <span className='text-sm font-medium'>最後登入</span>
                </div>
                <p className='text-gray-900'>{formatDate(user.lastLogin)}</p>
              </div>
            </div>

            {/* 簡介 */}
            {user.bio && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <UserIcon className='w-4 h-4' />
                  <span className='text-sm font-medium'>簡介</span>
                </div>
                <p className='text-gray-700 bg-gray-50 p-3 rounded'>
                  {user.bio}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value='permissions' className='mt-4'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-gray-700 mb-4'>
                <Shield className='w-5 h-5' />
                <h3 className='font-semibold'>權限列表</h3>
              </div>

              {user.permissions && user.permissions.length > 0 ? (
                <div className='space-y-2'>
                  {user.permissions.map(permission => (
                    <div
                      key={permission}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200'
                    >
                      <span className='text-sm text-gray-700'>
                        {permission}
                      </span>
                      <Badge variant='default'>已授權</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-8'>沒有特殊權限</p>
              )}

              <div className='bg-blue-50 border border-blue-200 p-4 rounded mt-4'>
                <p className='text-sm text-blue-700'>
                  💡 權限由角色決定。{ROLES[user.role].label}
                  擁有對應的系統權限。
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='activity' className='mt-4'>
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-700 mb-4'>近期活動</h3>

              {/* Mock activity data */}
              <div className='space-y-3'>
                <div className='flex items-start gap-3 p-3 bg-gray-50 rounded'>
                  <div className='w-2 h-2 bg-green-500 rounded-full mt-2' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      登入系統
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatDate(user.lastLogin)}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 bg-gray-50 rounded'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full mt-2' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      帳號創建
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                {user.status === 'active' && (
                  <div className='flex items-start gap-3 p-3 bg-gray-50 rounded'>
                    <div className='w-2 h-2 bg-green-500 rounded-full mt-2' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        帳號啟用
                      </p>
                      <p className='text-xs text-gray-500'>
                        系統管理員審核通過
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className='text-xs text-gray-500 text-center mt-4'>
                顯示最近 3 筆活動記錄
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
