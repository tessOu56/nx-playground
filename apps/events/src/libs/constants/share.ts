import { ENV_CONFIG } from './environment';

import type { Event } from '@/types';

// 分享配置
export const SHARE_CONFIG = {
  // 默認分享文字模板
  DEFAULT_TEXT_TEMPLATE: (event: Event) => `${event.title}

日期: ${event.date}
地點: ${event.location}
主辦: ${event.vendorId}
費用: ${event.price}

${event.description}

立即報名: ${ENV_CONFIG.PRODUCTION_DOMAIN}/events/${event.id}`,

  // Flex Message 模板
  FLEX_MESSAGE_TEMPLATE: (event: Event) => ({
    type: 'flex' as const,
    altText: `活動資訊: ${event.title}`,
    contents: {
      type: 'bubble' as const,
      size: 'kilo' as const,
      hero: {
        type: 'image' as const,
        url: event.image,
        size: 'full' as const,
        aspectRatio: '20:13' as const,
        aspectMode: 'cover' as const,
      },
      body: {
        type: 'box' as const,
        layout: 'vertical' as const,
        contents: [
          {
            type: 'text' as const,
            text: event.title,
            weight: 'bold' as const,
            size: 'lg' as const,
            wrap: true,
          },
          {
            type: 'text' as const,
            text: event.description,
            size: 'sm' as const,
            color: '#666666',
            wrap: true,
            margin: 'md' as const,
          },
          {
            type: 'box' as const,
            layout: 'vertical' as const,
            spacing: 'sm' as const,
            margin: 'lg' as const,
            contents: [
              {
                type: 'box' as const,
                layout: 'horizontal' as const,
                contents: [
                  {
                    type: 'text' as const,
                    text: '日期',
                    size: 'sm' as const,
                    flex: 0,
                  },
                  {
                    type: 'text' as const,
                    text: `${event.date}`,
                    size: 'sm' as const,
                    color: '#666666',
                    flex: 1,
                  },
                ],
              },
              {
                type: 'box' as const,
                layout: 'horizontal' as const,
                contents: [
                  {
                    type: 'text' as const,
                    text: '地點',
                    size: 'sm' as const,
                    flex: 0,
                  },
                  {
                    type: 'text' as const,
                    text: event.location,
                    size: 'sm' as const,
                    color: '#666666',
                    flex: 1,
                  },
                ],
              },
              {
                type: 'box' as const,
                layout: 'horizontal' as const,
                contents: [
                  {
                    type: 'text' as const,
                    text: '👥',
                    size: 'sm' as const,
                    flex: 0,
                  },
                  {
                    type: 'text' as const,
                    text: `${event.attendees}/${event.capacity} 人已報名`,
                    size: 'sm' as const,
                    color: '#666666',
                    flex: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box' as const,
        layout: 'vertical' as const,
        contents: [
          {
            type: 'button' as const,
            style: 'primary' as const,
            action: {
              type: 'uri' as const,
              label: '立即報名',
              uri: `${ENV_CONFIG.PRODUCTION_DOMAIN}/events/${event.id}`,
            },
          },
        ],
      },
    },
  }),
} as const;

// 獲取分享文字
export const getShareText = (event: Event) => {
  return SHARE_CONFIG.DEFAULT_TEXT_TEMPLATE(event);
};

// 獲取 Flex Message
export const getFlexMessage = (event: Event) => {
  return SHARE_CONFIG.FLEX_MESSAGE_TEMPLATE(event);
};
