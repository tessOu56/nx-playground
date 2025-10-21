import { useModal } from '@nx-playground/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@nx-playground/ui-components';
import { useState, useEffect } from 'react';

import type { User, UserFormData } from '../types';
import { ROLES, STATUSES } from '../types';

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
}

export function UserEditDialog({
  user,
  isOpen,
  onClose,
  onSave,
}: UserEditDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    status: 'pending',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{user ? '編輯用戶' : '新增用戶'}</DialogTitle>
          <DialogDescription>
            {user ? '更新用戶資訊和權限設定' : '創建新的用戶帳號'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            {/* 姓名 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                姓名 <span className='text-red-500'>*</span>
              </label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder='請輸入姓名'
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email <span className='text-red-500'>*</span>
              </label>
              <Input
                type='email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder='user@example.com'
              />
            </div>

            {/* 角色 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                角色
              </label>
              <Select
                value={formData.role}
                onValueChange={value =>
                  setFormData({ ...formData, role: value as User['role'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLES).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 狀態 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                狀態
              </label>
              <Select
                value={formData.status}
                onValueChange={value =>
                  setFormData({ ...formData, status: value as User['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUSES).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 電話 */}
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                電話
              </label>
              <Input
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder='0912-345-678'
              />
            </div>

            {/* 簡介 */}
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                簡介
              </label>
              <Textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder='用戶簡介...'
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              取消
            </Button>
            <Button type='submit' variant='primary'>
              {user ? '更新' : '創建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

