'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPaymentIntent,
  listPaymentIntents,
} from '@nx-playground/api-client/event-stack';

export function usePaymentIntents(orderId: string, enabled = true) {
  return useQuery({
    queryKey: ['event-stack', 'payment-intents', orderId],
    queryFn: () => listPaymentIntents(orderId),
    enabled: enabled && Boolean(orderId),
    staleTime: 15 * 1000,
  });
}

export function useCreatePaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => createPaymentIntent({ orderId }),
    onSuccess: intent => {
      queryClient.invalidateQueries({
        queryKey: ['event-stack', 'payment-intents', intent.orderId],
      });
    },
  });
}
