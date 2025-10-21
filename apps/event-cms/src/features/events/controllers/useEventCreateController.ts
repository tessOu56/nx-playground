/**
 * Event Create Controller
 *
 * 集中管理活動創建頁面的業務邏輯
 */

import { useCallback } from 'react';

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
    try {
      await EventsService.createEvent(data);
      // Handle success
    } catch (error) {
      // Handle error
      console.error('Failed to create event:', error);
    }
  }, []);

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
