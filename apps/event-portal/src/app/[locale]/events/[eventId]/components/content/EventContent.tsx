'use client';

import { Prose, Card } from '@/components';
import {
  // 標題組件
  Heading2,
  Heading3,
  // 文字組件
  Text,
  // 引言組件
  Quote,
  // 列表組件
  List,
  ListItem,
  // 其他組件
  CoverImage,
} from '@/components/editor';
import {
  parseListItems,
  detectOrderedList,
  parseListItemStyle,
} from '@/components/editor/utils';
import type { EventContentBlock } from '@/types';

interface EventContentProps {
  content: EventContentBlock[];
}

export function EventContent({ content }: EventContentProps) {
  if (!content || content.length === 0) {
    return (
      <Card className='p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>活動內容</h2>
        <div className='text-center py-8'>
          <span
            className='text-gray-400 text-4xl mb-4 block'
            role='img'
            aria-label='文件'
          >
            📄
          </span>
          <p className='text-gray-500'>該活動沒有詳細內容</p>
        </div>
      </Card>
    );
  }

  // 渲染內容區塊的函式 - 匹配後端數據結構
  const renderContentBlock = (block: EventContentBlock, index: number) => {
    const key = `content-${index}`;

    switch (block.type) {
      // 標題類型
      case 'h2':
        return <Heading2 key={key}>{block.text_data}</Heading2>;
      case 'h2_italic':
        return <Heading2 key={key}>{block.text_data}</Heading2>;
      case 'h2_link':
        return <Heading2 key={key}>{block.text_data}</Heading2>;

      // 副標題類型
      case 'h3':
        return <Heading3 key={key}>{block.text_data}</Heading3>;
      case 'h3_italic':
        return <Heading3 key={key}>{block.text_data}</Heading3>;
      case 'h3_link':
        return <Heading3 key={key}>{block.text_data}</Heading3>;

      // 一般文字類型
      case 'text':
        return <Text key={key}>{block.text_data}</Text>;
      case 'text_bold':
        return <Text key={key}>{block.text_data}</Text>;
      case 'text_italic':
        return <Text key={key}>{block.text_data}</Text>;
      case 'text_link':
        return <Text key={key}>{block.text_data}</Text>;

      // 引言類型
      case 'quote':
        return <Quote key={key}>{block.text_data}</Quote>;
      case 'quote_bold':
        return <Quote key={key}>{block.text_data}</Quote>;
      case 'quote_italic':
        return <Quote key={key}>{block.text_data}</Quote>;
      case 'quote_link':
        return <Quote key={key}>{block.text_data}</Quote>;

      // 智能列表類型
      case 'list': {
        const items = parseListItems(block.text_data ?? '');
        const isOrdered = detectOrderedList(items);

        return (
          <List key={key} isOrdered={isOrdered}>
            {items.map((item, itemIndex) => {
              const itemInfo = parseListItemStyle(item);
              const itemKey = `${key}-item-${itemIndex}-${itemInfo.content
                .slice(0, 10)
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '')}`;
              return (
                <ListItem
                  key={itemKey}
                  style={itemInfo.style}
                  href={itemInfo.href}
                >
                  {itemInfo.content}
                </ListItem>
              );
            })}
          </List>
        );
      }

      // 圖片類型
      case 'image':
        return (
          <CoverImage
            key={key}
            src={block.image_data ?? ''}
            alt={block.text_data ?? '活動圖片'}
            caption={block.text_data}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className='p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-6'>活動內容</h2>
      <Prose>
        {content.map((block, index) => renderContentBlock(block, index))}
      </Prose>
    </Card>
  );
}
