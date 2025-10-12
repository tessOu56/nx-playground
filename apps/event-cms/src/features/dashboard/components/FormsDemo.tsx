import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Prose,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@nx-playground/ui-components';
import * as React from 'react';

export const FormsDemo: React.FC = () => {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-text-primary mb-2'>
          表單組件展示
        </h1>
        <p className='text-text-secondary'>
          展示 @tailwindcss/forms 和 @tailwindcss/typography 插件的功能
        </p>
      </div>

      {/* Forms Demo */}
      <Card>
        <CardHeader>
          <CardTitle>表單組件 (@tailwindcss/forms)</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label
                htmlFor='name'
                className='text-sm font-medium text-text-primary'
              >
                姓名
              </label>
              <Input id='name' placeholder='請輸入姓名' className='w-full' />
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-text-primary'
              >
                電子郵件
              </label>
              <Input
                id='email'
                type='email'
                placeholder='請輸入電子郵件'
                className='w-full'
              />
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='category'
                className='text-sm font-medium text-text-primary'
              >
                類別
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='選擇類別' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='tech'>技術</SelectItem>
                  <SelectItem value='design'>設計</SelectItem>
                  <SelectItem value='marketing'>行銷</SelectItem>
                  <SelectItem value='other'>其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='priority'
                className='text-sm font-medium text-text-primary'
              >
                優先級
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='選擇優先級' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>低</SelectItem>
                  <SelectItem value='medium'>中</SelectItem>
                  <SelectItem value='high'>高</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='description'
              className='text-sm font-medium text-text-primary'
            >
              描述
            </label>
            <Textarea
              id='description'
              placeholder='請輸入詳細描述...'
              className='w-full min-h-[100px]'
            />
          </div>

          <div className='flex gap-3'>
            <Button>提交</Button>
            <Button variant='outline'>取消</Button>
          </div>
        </CardContent>
      </Card>

      {/* Typography Demo */}
      <Card>
        <CardHeader>
          <CardTitle>排版組件 (@tailwindcss/typography)</CardTitle>
        </CardHeader>
        <CardContent>
          <Prose>
            <h2>活動管理指南</h2>
            <p>
              這是一個使用 <code>@tailwindcss/typography</code>{' '}
              插件的示例。這個插件提供了豐富的排版樣式，
              讓你可以輕鬆創建美觀的文章和文檔內容。
            </p>

            <h3>主要功能</h3>
            <ul>
              <li>自動樣式化標題、段落、列表等元素</li>
              <li>支援代碼塊和內聯代碼</li>
              <li>美觀的引用和表格樣式</li>
              <li>響應式設計</li>
            </ul>

            <blockquote>
              <p>好的設計是顯而易見的，偉大的設計是透明的。</p>
            </blockquote>

            <h3>表格示例</h3>
            <table>
              <thead>
                <tr>
                  <th>活動名稱</th>
                  <th>日期</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>React 開發者大會</td>
                  <td>2024-12-01</td>
                  <td>進行中</td>
                </tr>
                <tr>
                  <td>UI/UX 設計工作坊</td>
                  <td>2024-12-15</td>
                  <td>已結束</td>
                </tr>
                <tr>
                  <td>前端技術分享會</td>
                  <td>2025-01-10</td>
                  <td>即將開始</td>
                </tr>
              </tbody>
            </table>
          </Prose>
        </CardContent>
      </Card>
    </div>
  );
};
