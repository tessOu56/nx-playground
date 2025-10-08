import { Input } from '@nx-playground/ui-components';

import { useNavigateStore } from '../../useEventStore';
import { Text } from '../core';

const navigationItems = [
  { id: 0, label: '活動定義', icon: '📋' },
  { id: 1, label: '安排場次', icon: '📅' },
  { id: 2, label: '設定票券', icon: '⚙️' },
  { id: 3, label: '設定表單', icon: '📝' },
  { id: 4, label: '發布設定', icon: '📝' },
];

export function EventCreateSidebar() {
  const { navigate } = useNavigateStore();
  return (
    <div className='w-64 bg-background-primary  border-gray-200 min-h-screen border-r'>
      <nav className='w-full px-3 py-4 gap-2.5 flex items-center justify-center flex-col'>
        <Text variant='title' className='p-4 gap-2.5 w-full text-start'>
          步驟{navigate + 1}/5
        </Text>
        {navigationItems.map(item => {
          return (
            <div
              className={`w-full p-4 gap-2.5 rounded-md flex flex-row ${
                navigate === item.id ? 'bg-blue-200' : ''
              }`}
              key={item.id}
            >
              <Input
                type='checkbox'
                checked={navigate > item.id}
                readOnly
                className='w-6 h-6 rounded-full'
              />
              <Text variant='content'>{item.label}</Text>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
