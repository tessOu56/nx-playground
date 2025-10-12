import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nx-playground/ui-components';
import { useState } from 'react';

/**
 * UI Components 範例
 *
 * 這個範例展示了如何使用 @nx-playground/ui-components 庫中的組件
 * 新開發者可以通過這個範例了解可用的 UI 組件
 */
export const UIComponentsExample = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-2'>UI Components 範例</h1>
        <p className='text-gray-600'>
          這個頁面展示了 @nx-playground/ui-components 庫中所有可用的組件。
          新開發者可以通過這個範例了解如何使用這些組件。
        </p>
      </div>

      {/* Button 範例 */}
      <Card>
        <CardHeader>
          <CardTitle>Button 組件</CardTitle>
          <CardDescription>不同變體的按鈕組件</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-4 flex-wrap'>
            <Button variant='primary'>主要按鈕</Button>
            <Button variant='secondary'>次要按鈕</Button>
            <Button variant='outline'>外框按鈕</Button>
            <Button variant='ghost'>幽靈按鈕</Button>
            <Button variant='destructive'>危險按鈕</Button>
            <Button variant='link'>連結按鈕</Button>
          </div>
        </CardContent>
      </Card>

      {/* Input 範例 */}
      <Card>
        <CardHeader>
          <CardTitle>Input 組件</CardTitle>
          <CardDescription>表單輸入組件</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>姓名</label>
              <Input
                placeholder='請輸入您的姓名'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>電子郵件</label>
              <Input type='email' placeholder='example@email.com' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Select 範例 */}
      <Card>
        <CardHeader>
          <CardTitle>Select 組件</CardTitle>
          <CardDescription>下拉選擇組件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                國家/地區
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='選擇國家/地區' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='tw'>台灣</SelectItem>
                  <SelectItem value='jp'>日本</SelectItem>
                  <SelectItem value='kr'>韓國</SelectItem>
                  <SelectItem value='us'>美國</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>語言</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='選擇語言' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='zh'>繁體中文</SelectItem>
                  <SelectItem value='en'>English</SelectItem>
                  <SelectItem value='ja'>日本語</SelectItem>
                  <SelectItem value='ko'>한국어</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 組合使用範例 */}
      <Card>
        <CardHeader>
          <CardTitle>組合使用範例</CardTitle>
          <CardDescription>展示如何組合多個組件</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>用戶名</label>
              <Input placeholder='請輸入用戶名' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>角色</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='選擇角色' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>管理員</SelectItem>
                  <SelectItem value='user'>一般用戶</SelectItem>
                  <SelectItem value='guest'>訪客</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex gap-4'>
            <Button variant='primary'>保存設定</Button>
            <Button variant='outline'>取消</Button>
            <Button variant='ghost'>重置</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UIComponentsExample;
