/**
 * Event Actions Hook
 *
 * 提供活動相關的操作函式
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EventsService } from '../services';
import { type EventFormValue } from '../types';

export function useEventActions() {
  const queryClient = useQueryClient();

  /**
   * 創建活動
   */
  const createEventMutation = useMutation({
    mutationFn: (data: EventFormValue) => EventsService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  /**
   * 更新活動
   */
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EventFormValue> }) =>
      EventsService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  /**
   * 刪除活動
   */
  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => EventsService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
}
