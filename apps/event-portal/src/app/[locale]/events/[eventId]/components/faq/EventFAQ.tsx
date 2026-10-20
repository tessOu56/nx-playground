'use client';

import { useState } from 'react';

import { Card } from '@/components';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { EventFAQ as FAQItem } from '@/types';

interface EventFAQProps {
  faq: FAQItem[];
  locale?: string;
}

export function EventFAQ({ faq, locale = 'zh-TW' }: EventFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const copy = demoCopy(locale);

  const toggleItem = (index: number) => {
    const next = new Set(openItems);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setOpenItems(next);
  };

  if (!faq || faq.length === 0) {
    return null;
  }

  return (
    <Card className='p-6'>
      <h2 className='text-xl font-semibold text-foreground mb-6'>{copy.faq}</h2>
      <div className='space-y-4'>
        {faq.map((item, index) => {
          const panelId = `event-faq-panel-${index}`;
          const isOpen = openItems.has(index);
          return (
            <div key={index} className='border border-border rounded-lg'>
              <button
                type='button'
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className='flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted'
              >
                <span className='pr-4 font-medium text-foreground'>
                  {item.question}
                </span>
                <span className='flex-shrink-0 text-muted-foreground' aria-hidden>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen ? (
                <div id={panelId} className='px-4 pb-4'>
                  <div className='pt-2 border-t border-border'>
                    <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
