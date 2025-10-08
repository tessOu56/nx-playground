import liff from '@line/liff';

import { LINE_CONSTANTS } from '@/libs/line/constants';
import { isLiffInitialized } from '@/libs/line/liff';
import type { EventInfo } from '@/types';

// 發送純文字訊息到官方帳號
export const sendTextMessage = async (text: string) => {
  if (!isLiffInitialized()) {
    throw new Error(LINE_CONSTANTS.ERRORS.INIT_FAILED);
  }

  if (!liff.isInClient()) {
    throw new Error(LINE_CONSTANTS.ERRORS.NOT_IN_CLIENT);
  }

  if (!liff.isLoggedIn()) {
    throw new Error(LINE_CONSTANTS.ERRORS.NOT_LOGGED_IN);
  }

  try {
    await liff.sendMessages([
      {
        type: 'text' as const,
        text,
      },
    ]);

    return {
      success: true,
      message: LINE_CONSTANTS.SUCCESS.MESSAGE_SENT,
    };
  } catch (_error) {
    throw new Error(LINE_CONSTANTS.ERRORS.MESSAGE_FAILED);
  }
};

// 發送 Flex Message 到官方帳號
export const sendFlexMessage = async (flexMessage: any) => {
  if (!isLiffInitialized()) {
    throw new Error(LINE_CONSTANTS.ERRORS.INIT_FAILED);
  }

  if (!liff.isInClient()) {
    throw new Error(LINE_CONSTANTS.ERRORS.NOT_IN_CLIENT);
  }

  if (!liff.isLoggedIn()) {
    throw new Error(LINE_CONSTANTS.ERRORS.NOT_LOGGED_IN);
  }

  try {
    await liff.sendMessages([flexMessage]);

    return {
      success: true,
      message: LINE_CONSTANTS.SUCCESS.MESSAGE_SENT,
    };
  } catch (_error) {
    throw new Error(LINE_CONSTANTS.ERRORS.MESSAGE_FAILED);
  }
};

// 發送多個訊息到官方帳號
export const sendMultipleMessages = async (messages: any[]) => {
  if (!isLiffInitialized()) {
    throw new Error(LINE_CONSTANTS.ERRORS.INIT_FAILED);
  }

  if (!liff.isInClient()) {
    throw new Error(LINE_CONSTANTS.ERRORS.NOT_IN_CLIENT);
  }

  if (!liff.isLoggedIn()) {
    throw new Error(LINE_CONSTANTS.ERRORS.NOT_LOGGED_IN);
  }

  try {
    await liff.sendMessages(messages);

    return {
      success: true,
      message: LINE_CONSTANTS.SUCCESS.MESSAGE_SENT,
    };
  } catch (_error) {
    throw new Error(LINE_CONSTANTS.ERRORS.MESSAGE_FAILED);
  }
};

// 發送活動資訊訊息
export const sendEventMessage = async (event: EventInfo) => {
  const message = `活動資訊

日期: ${event.date}
地點: ${event.location}
主辦: ${event.organizer}
費用: ${event.price}

${event.description}

立即報名: ${
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ?? 'https://frontend.oosa.life'
  }/events/${event.id}`;

  return await sendTextMessage(message);
};
