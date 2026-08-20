/**
 * Event Create Controller
 *
 * 集中管理活動創建頁面的業務邏輯
 */

import { useAuth } from '@nx-playground/auth-client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { EventsService } from '../services';
import {
  useEventStore,
  useFormStore,
  useNavigateStore,
  usePreviewStore,
  useSessionStore,
  useTicketStore,
} from '../stores';
import { type EventFormValue } from '../types';

export function useEventCreateController() {
  const goToEvents = useNavigate();
  const { isAuthenticated } = useAuth();
  // Stores
  const { navigate, setNavigate } = useNavigateStore();
  const { editingBlock, setEditingBlock } = useEventStore();
  const { editingSessionId, setEditingSessionId, hasSession } =
    useSessionStore();
  const { editingTicketId, setEditingTicketId, hasTicket } = useTicketStore();
  const { editingFormId, setEditingFormId, hasForm } = useFormStore();
  const { openPreferAccount } = usePreviewStore();

  /**
   * 處理表單提交
   */
  const handleSubmit = useCallback(async (data: EventFormValue) => {
    if (!isAuthenticated) {
      window.alert('請先以主辦身份登入（Kratos）。參加者請走 portal／LIFF，不要用這頁註冊。');
      return;
    }
    try {
      await EventsService.createEvent(data);
      goToEvents('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
      window.alert(
        '無法連線活動 API，活動未寫入。請確認 API 網址（VITE_API_BASE_URL）可連線。'
      );
    }
  }, [goToEvents, isAuthenticated]);

  /**
   * 處理圖片上傳
   */
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const url = await EventsService.uploadImage(file);
      return url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  }, []);

  /**
   * 切換導航
   */
  const handleNavigate = useCallback(
    (newNav: typeof navigate) => {
      setNavigate(newNav);
    },
    [setNavigate]
  );

  /**
   * 切換編輯區塊
   */
  const handleEditBlock = useCallback(
    (newBlock: typeof editingBlock) => {
      setEditingBlock(newBlock);
    },
    [setEditingBlock]
  );

  return {
    // State
    navigate,
    editingBlock,
    editingSessionId,
    editingTicketId,
    editingFormId,
    hasSession,
    hasTicket,
    hasForm,
    openPreferAccount,

    // Actions
    handleSubmit,
    handleImageUpload,
    handleNavigate,
    handleEditBlock,
    setEditingSessionId,
    setEditingTicketId,
    setEditingFormId,
  };
}
