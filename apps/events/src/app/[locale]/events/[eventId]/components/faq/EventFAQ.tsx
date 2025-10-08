'use client';

import { useState } from 'react';

import { Textarea, Card, Button } from '@/components';
import type { EventFAQ as FAQItem } from '@/types';

interface EventFAQProps {
  faq: FAQItem[];
}

export function EventFAQ({ faq }: EventFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  if (!faq || faq.length === 0) {
    return (
      <Card className='p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>常見問題</h2>
        <div className='text-center py-8'>
          <span
            className='text-gray-400 text-4xl mb-4 block'
            role='img'
            aria-label='問號'
          >
            ❓
          </span>
          <p className='text-gray-500'>該活動無 FAQ</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-6'>常見問題</h2>
      <div className='space-y-4'>
        {faq.map((item, index) => (
          <div key={index} className='border border-gray-200 rounded-lg'>
            <Button
              onClick={() => toggleItem(index)}
              variant='ghost'
              className='w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
            >
              <span className='font-medium text-gray-900 pr-4'>
                {item.question}
              </span>
              <span className='text-gray-500 flex-shrink-0'>
                {openItems.has(index) ? '−' : '+'}
              </span>
            </Button>
            {openItems.has(index) && (
              <div className='px-4 pb-4'>
                <div className='pt-2 border-t border-gray-100'>
                  {/* 判斷是否為多行文本，如果是則使用 textarea，否則使用 p */}
                  {item.answer && item.answer.length > 100 ? (
                    <Textarea
                      value={item.answer}
                      readOnly
                      className='w-full min-h-[100px] resize-none border-none bg-transparent text-gray-700 leading-relaxed p-0 focus:ring-0 focus:outline-none'
                    />
                  ) : (
                    <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {item.answer}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
