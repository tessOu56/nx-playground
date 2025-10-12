import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Switch,
  Alert,
  AlertDescription,
} from '@nx-playground/ui-components';
import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='w-5 h-5' />
          安全設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* 密碼變更 */}
          <div>
            <h3 className='font-medium text-gray-900 mb-3 flex items-center gap-2'>
              <Key className='w-4 h-4' />
              密碼管理
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  當前密碼
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  新密碼
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  確認新密碼
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                />
              </div>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={showPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setShowPassword(e.target.checked)
                  }
                />
                <span className='text-sm text-gray-600'>顯示密碼</span>
              </div>
              <Button variant='primary' size='sm'>
                更新密碼
              </Button>
            </div>
          </div>

          <div className='border-t pt-6'>
            {/* 雙因素認證 */}
            <h3 className='font-medium text-gray-900 mb-3 flex items-center gap-2'>
              <Smartphone className='w-4 h-4' />
              雙因素認證
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm'>啟用 2FA</p>
                  <p className='text-xs text-gray-500'>
                    使用 Google Authenticator 或類似應用程式
                  </p>
                </div>
                <Switch
                  checked={twoFactor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTwoFactor(e.target.checked)
                  }
                />
              </div>

              {twoFactor && (
                <Alert variant='info'>
                  <AlertDescription>
                    啟用後，登入時需要輸入動態驗證碼。請先設定驗證應用程式。
                  </AlertDescription>
                </Alert>
              )}

              {twoFactor && (
                <div className='bg-gray-50 p-4 rounded space-y-2'>
                  <p className='text-sm font-medium'>設定步驟：</p>
                  <ol className='text-sm text-gray-600 space-y-1 list-decimal list-inside'>
                    <li>下載 Google Authenticator 或 Authy</li>
                    <li>掃描下方 QR Code</li>
                    <li>輸入驗證碼完成設定</li>
                  </ol>
                  <div className='flex justify-center py-4'>
                    <div className='w-32 h-32 bg-gray-200 rounded flex items-center justify-center'>
                      <span className='text-xs text-gray-500'>QR Code</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='border-t pt-6'>
            {/* 會話管理 */}
            <h3 className='font-medium text-gray-900 mb-3'>會話管理</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  會話超時時間 (分鐘)
                </label>
                <Input
                  type='number'
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  min='5'
                  max='120'
                  className='w-32'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  閒置 {sessionTimeout} 分鐘後自動登出
                </p>
              </div>

              <Button variant='destructive' size='sm'>
                登出所有裝置
              </Button>
            </div>
          </div>

          {/* Warning */}
          <Alert variant='warning'>
            <AlertTriangle className='w-4 h-4' />
            <AlertDescription>
              變更安全設定可能會影響您的帳號安全。請確保您了解每項設定的影響。
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}

