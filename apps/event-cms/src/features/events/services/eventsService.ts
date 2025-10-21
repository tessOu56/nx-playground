/**
 * Events Service - API 調用層
 *
 * 負責所有與活動相關的 API 調用
 */

import { type EventFormValue } from '../types';

export class EventsService {
  /**
   * 創建活動
   */
  static async createEvent(data: EventFormValue): Promise<void> {
    // TODO: 實作 API 調用
    console.log('Creating event:', data);
  }

  /**
   * 更新活動
   */
  static async updateEvent(
    id: string,
    data: Partial<EventFormValue>
  ): Promise<void> {
    // TODO: 實作 API 調用
    console.log('Updating event:', id, data);
  }

  /**
   * 刪除活動
   */
  static async deleteEvent(id: string): Promise<void> {
    // TODO: 實作 API 調用
    console.log('Deleting event:', id);
  }

  /**
   * 取得活動列表
   */
  static async getEvents(): Promise<any[]> {
    // TODO: 實作 API 調用
    return [];
  }

  /**
   * 取得單一活動
   */
  static async getEventById(id: string): Promise<any> {
    // TODO: 實作 API 調用
    return null;
  }

  /**
   * 上傳圖片
   */
  static async uploadImage(file: File): Promise<string> {
    // TODO: 實作圖片上傳
    return URL.createObjectURL(file);
  }
}
