import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
} from '@nx-playground/ui-components';
import { User, Upload, Save } from 'lucide-react';
import { useState } from 'react';

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: '張小明',
    email: 'zhang@example.com',
    phone: '0912-345-678',
    bio: '系統管理員，負責平台維護和用戶管理。',
    avatar: null as string | null,
  });

  const handleSave = () => {
    console.log('Saving profile:', profile);
    // TODO: Implement actual save logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='w-5 h-5' />
          個人資料
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Avatar */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              頭像
            </label>
            <div className='flex items-center gap-4'>
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl'>
                {profile.name.charAt(0)}
              </div>
              <Button variant='outline' size='sm' className='gap-2'>
                <Upload className='w-4 h-4' />
                上傳頭像
              </Button>
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              建議尺寸: 200x200px，格式: JPG, PNG，大小不超過 2MB
            </p>
          </div>

          {/* Basic Info */}
          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                姓名 <span className='text-red-500'>*</span>
              </label>
              <Input
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email <span className='text-red-500'>*</span>
              </label>
              <Input
                type='email'
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Email 變更後需要重新驗證
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                電話
              </label>
              <Input
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder='0912-345-678'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                個人簡介
              </label>
              <Textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                placeholder='介紹一下自己...'
                rows={4}
              />
              <p className='text-xs text-gray-500 mt-1'>
                {profile.bio.length} / 200 字元
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-end gap-2 pt-4 border-t'>
            <Button variant='outline'>取消</Button>
            <Button variant='primary' onClick={handleSave} className='gap-2'>
              <Save className='w-4 h-4' />
              儲存變更
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

