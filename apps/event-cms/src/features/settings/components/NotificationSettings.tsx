import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Switch,
} from '@nx-playground/ui-components';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    eventReminders: true,
    newRegistrations: true,
    systemUpdates: false,
  });

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='w-5 h-5' />
          通知設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* 通知渠道 */}
          <div>
            <h3 className='font-medium text-gray-900 mb-3'>通知渠道</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>Email 通知</p>
                  <p className='text-xs text-gray-500'>
                    接收重要活動和系統通知
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNotification('email', e.target.checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>推送通知</p>
                  <p className='text-xs text-gray-500'>瀏覽器推送通知</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNotification('push', e.target.checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>簡訊通知</p>
                  <p className='text-xs text-gray-500'>重要事件的簡訊提醒</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNotification('sms', e.target.checked)
                  }
                />
              </div>
            </div>
          </div>

          <div className='border-t pt-4'>
            <h3 className='font-medium text-gray-900 mb-3'>通知類型</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>活動提醒</p>
                  <p className='text-xs text-gray-500'>活動開始前的提醒通知</p>
                </div>
                <Switch
                  checked={notifications.eventReminders}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNotification('eventReminders', e.target.checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>新報名通知</p>
                  <p className='text-xs text-gray-500'>有新用戶報名活動時通知</p>
                </div>
                <Switch
                  checked={notifications.newRegistrations}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNotification('newRegistrations', e.target.checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>系統更新</p>
                  <p className='text-xs text-gray-500'>系統維護和更新通知</p>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNotification('systemUpdates', e.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

