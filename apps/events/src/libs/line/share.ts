import liff from '@line/liff';

import { getShareText, getFlexMessage } from '../constants/share';

import { LINE_CONSTANTS } from './constants';
import { isLiffInitialized } from './liff';

import type { Event } from '@/types';

// 分享活動到 LINE 聊天
export const shareEventToChat = async (event: Event) => {
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
    // 使用統一的分享文字模板
    const shareText = getShareText(event);

    // 使用 shareTargetPicker 分享文字
    if (liff.isApiAvailable('shareTargetPicker')) {
      const shareResult = await liff.shareTargetPicker([
        {
          type: 'text',
          text: shareText,
        },
      ]);

      if (shareResult) {
        return {
          success: true,
          message: LINE_CONSTANTS.SUCCESS.SHARE_SUCCESS,
        };
      } else {
        throw new Error('分享被取消');
      }
    } else {
      // 降級到 LINE 分享 URL
      const shareUrl = `${
        LINE_CONSTANTS.SHARE_URLS.TEXT_MESSAGE
      }?${encodeURIComponent(shareText)}`;
      window.open(shareUrl, '_blank');
      return {
        success: true,
        message: '已開啟 LINE 分享頁面',
      };
    }
  } catch (error) {
    throw new Error(LINE_CONSTANTS.ERRORS.SHARE_FAILED);
  }
};

// 分享 Flex Message 到 LINE 聊天
export const shareFlexMessageToChat = async (event: Event) => {
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
    // 使用統一的 Flex Message 模板
    const flexMessage = getFlexMessage(event);

    // 使用 shareTargetPicker 分享 Flex Message
    if (liff.isApiAvailable('shareTargetPicker')) {
      const shareResult = await liff.shareTargetPicker([flexMessage]);

      if (shareResult) {
        return {
          success: true,
          message: LINE_CONSTANTS.SUCCESS.SHARE_SUCCESS,
        };
      } else {
        throw new Error('分享被取消');
      }
    } else {
      // 降級到文字分享
      return await shareEventToChat(event);
    }
  } catch (error) {
    throw new Error(LINE_CONSTANTS.ERRORS.SHARE_FAILED);
  }
};

// 分享到外部應用（非 LINE 環境）
export const shareToExternal = async (event: Event) => {
  try {
    const shareText = getShareText(event);

    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: shareText,
        url: `${
          process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ||
          'https://frontend.oosa.life'
        }/events/${event.id}`,
      });

      return {
        success: true,
        message: '分享成功',
      };
    } else {
      // 降級到 LINE 分享 URL
      const shareUrl = `${
        LINE_CONSTANTS.SHARE_URLS.TEXT_MESSAGE
      }?${encodeURIComponent(shareText)}`;
      window.open(shareUrl, '_blank');
      return {
        success: true,
        message: '已開啟 LINE 分享頁面',
      };
    }
  } catch (error) {
    throw new Error('分享失敗，請稍後再試');
  }
};

// 智能分享（根據環境自動選擇分享方式）
export const smartShare = async (event: Event) => {
  if (isLiffInitialized() && liff.isInClient()) {
    // 在 LINE 環境中，優先使用 Flex Message
    return await shareFlexMessageToChat(event);
  } else {
    // 在外部環境中，使用外部分享
    return await shareToExternal(event);
  }
};
