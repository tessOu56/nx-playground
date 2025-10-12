import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@nx-playground/ui-components';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'NX Playground Event CMS',
    siteUrl: 'https://event-cms.nx-playground.local',
    contactEmail: 'admin@nx-playground.local',
    maxUploadSize: '10',
    timezone: 'Asia/Taipei',
    dateFormat: 'YYYY-MM-DD',
    enableRegistration: true,
    requireEmailVerification: true,
    enableMockData: true,
    maintenanceMode: false,
    maintenanceMessage: '',
  });

  const handleSave = () => {
    console.log('Saving system settings:', settings);
    // TODO: Implement actual save logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings className='w-5 h-5' />
          系統設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* 網站設定 */}
          <div>
            <h3 className='font-medium text-gray-900 mb-3'>網站資訊</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  網站名稱
                </label>
                <Input
                  value={settings.siteName}
                  onChange={e =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  網站網址
                </label>
                <Input
                  value={settings.siteUrl}
                  onChange={e =>
                    setSettings({ ...settings, siteUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  聯絡 Email
                </label>
                <Input
                  type='email'
                  value={settings.contactEmail}
                  onChange={e =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className='border-t pt-6'>
            {/* 一般設定 */}
            <h3 className='font-medium text-gray-900 mb-3'>一般設定</h3>
            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    時區
                  </label>
                  <Select
                    value={settings.timezone}
                    onValueChange={value =>
                      setSettings({ ...settings, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Asia/Taipei'>台北 (UTC+8)</SelectItem>
                      <SelectItem value='Asia/Tokyo'>東京 (UTC+9)</SelectItem>
                      <SelectItem value='America/New_York'>
                        紐約 (UTC-5)
                      </SelectItem>
                      <SelectItem value='Europe/London'>倫敦 (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    日期格式
                  </label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={value =>
                      setSettings({ ...settings, dateFormat: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='YYYY-MM-DD'>2024-01-15</SelectItem>
                      <SelectItem value='DD/MM/YYYY'>15/01/2024</SelectItem>
                      <SelectItem value='MM/DD/YYYY'>01/15/2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  最大上傳大小 (MB)
                </label>
                <Input
                  type='number'
                  value={settings.maxUploadSize}
                  onChange={e =>
                    setSettings({ ...settings, maxUploadSize: e.target.value })
                  }
                  min='1'
                  max='100'
                  className='w-32'
                />
              </div>
            </div>
          </div>

          <div className='border-t pt-6'>
            {/* 註冊設定 */}
            <h3 className='font-medium text-gray-900 mb-3'>註冊設定</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>允許用戶註冊</p>
                  <p className='text-xs text-gray-500'>關閉後無法註冊新帳號</p>
                </div>
                <Switch
                  checked={settings.enableRegistration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({ ...settings, enableRegistration: e.target.checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>Email 驗證</p>
                  <p className='text-xs text-gray-500'>新用戶需驗證 Email</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({
                      ...settings,
                      requireEmailVerification: e.target.checked,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className='border-t pt-6'>
            {/* 開發者設定 */}
            <h3 className='font-medium text-gray-900 mb-3'>開發者設定</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>啟用 Mock 數據</p>
                  <p className='text-xs text-gray-500'>
                    使用模擬數據進行開發測試
                  </p>
                </div>
                <Switch
                  checked={settings.enableMockData}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({ ...settings, enableMockData: e.target.checked })
                  }
                />
              </div>
            </div>
          </div>

          <div className='border-t pt-6'>
            {/* 維護模式 */}
            <h3 className='font-medium text-gray-900 mb-3 flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 text-orange-600' />
              維護模式
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>啟用維護模式</p>
                  <p className='text-xs text-gray-500'>
                    系統將顯示維護中頁面，禁止訪問
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({ ...settings, maintenanceMode: e.target.checked })
                  }
                />
              </div>

              {settings.maintenanceMode && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    維護訊息
                  </label>
                  <Textarea
                    value={settings.maintenanceMessage}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        maintenanceMessage: e.target.value,
                      })
                    }
                    placeholder='系統維護中，預計 2 小時後恢復...'
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline'>重置</Button>
            <Button variant='primary' onClick={handleSave} className='gap-2'>
              <Save className='w-4 h-4' />
              儲存設定
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

