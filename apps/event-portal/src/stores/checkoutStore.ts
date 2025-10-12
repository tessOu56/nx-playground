import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// import type { PaymentMethod } from '@/types';

// SSR 安全檢查
const isClient = () => typeof window !== 'undefined';

interface CheckoutUIState {
  // 選中的場次 ID
  selectedSession: string | null;

  // 選中的票券數量 { ticketId: quantity }
  selectedTickets: { [key: string]: number };

  // 選中的付款方式
  selectedPaymentMethod: string | null;

  // 是否正在處理結帳
  isProcessing: boolean;

  // Actions
  setSelectedSession: (sessionId: string | null) => void;
  setSelectedTickets: (tickets: { [key: string]: number }) => void;
  updateTicketQuantity: (ticketId: string, quantity: number) => void;
  setSelectedPaymentMethod: (method: string | null) => void;
  setProcessing: (processing: boolean) => void;
  clearCheckoutData: () => void;

  // 計算總金額和總票數的輔助方法
  getTotalAmount: (event: unknown) => number;
  getTotalTickets: () => number;
  canProceed: () => boolean;

  // 獲取選中的場次和票券詳情
  getSelectedSessionData: (event: unknown) => unknown;
  getSelectedTicketDetails: (event: unknown) => Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// 創建 SSR 安全的 store
const createCheckoutStore = () => {
  if (!isClient()) {
    // SSR 階段：返回空的 store 實例
    return create<CheckoutUIState>()(() => ({
      selectedSession: null,
      selectedTickets: {},
      selectedPaymentMethod: null,
      isProcessing: false,
      setSelectedSession: (_sessionId: string | null) => {
        // SSR placeholder
      },
      setSelectedTickets: (_tickets: { [key: string]: number }) => {
        // SSR placeholder
      },
      updateTicketQuantity: (_ticketId: string, _quantity: number) => {
        // SSR placeholder
      },
      setSelectedPaymentMethod: (_method: string | null) => {
        // SSR placeholder
      },
      setProcessing: (_processing: boolean) => {
        // SSR placeholder
      },
      clearCheckoutData: () => {
        // SSR placeholder
      },
      getTotalAmount: () => 0,
      getTotalTickets: () => 0,
      canProceed: () => false,
      getSelectedSessionData: () => null,
      getSelectedTicketDetails: () => [],
    }));
  }

  // 客戶端：使用完整的 store 配置
  return create<CheckoutUIState>()(
    devtools(
      persist(
        (set, get) => ({
          selectedSession: null,
          selectedTickets: {},
          selectedPaymentMethod: null,
          isProcessing: false,

          setSelectedSession: (sessionId: string | null) => {
            set({ selectedSession: sessionId }, false, 'setSelectedSession');
            // 選擇新場次時清空票券選擇
            if (sessionId) {
              set(
                { selectedTickets: {} },
                false,
                'clearTicketsOnSessionChange'
              );
            }
          },

          setSelectedTickets: (tickets: { [key: string]: number }) => {
            set({ selectedTickets: tickets }, false, 'setSelectedTickets');
          },

          updateTicketQuantity: (ticketId: string, quantity: number) => {
            const currentTickets = get().selectedTickets;
            const newTickets = { ...currentTickets };

            if (quantity <= 0) {
              delete newTickets[ticketId];
            } else {
              newTickets[ticketId] = quantity;
            }

            set({ selectedTickets: newTickets }, false, 'updateTicketQuantity');
          },

          setSelectedPaymentMethod: (method: string | null) => {
            set(
              { selectedPaymentMethod: method },
              false,
              'setSelectedPaymentMethod'
            );
          },

          setProcessing: (processing: boolean) => {
            set({ isProcessing: processing }, false, 'setProcessing');
          },

          clearCheckoutData: () => {
            set(
              {
                selectedSession: null,
                selectedTickets: {},
                selectedPaymentMethod: null,
                isProcessing: false,
              },
              false,
              'clearCheckoutData'
            );
          },

          getTotalAmount: (event: unknown) => {
            const { selectedTickets } = get();
            const eventData = event as {
              sessions?: Array<{
                tickets?: Array<{ id: string; price: number }>;
              }>;
            };
            return Object.entries(selectedTickets).reduce(
              (sum, [ticketId, quantity]) => {
                const ticket = eventData?.sessions
                  ?.flatMap(s => s.tickets ?? [])
                  .find(t => t.id === ticketId);
                return sum + (ticket ? ticket.price * quantity : 0);
              },
              0
            );
          },

          getTotalTickets: () => {
            const { selectedTickets } = get();
            return Object.values(selectedTickets).reduce(
              (sum, quantity) => sum + quantity,
              0
            );
          },

          canProceed: () => {
            const { selectedSession, selectedPaymentMethod } = get();
            const totalTickets = get().getTotalTickets();
            return Boolean(
              selectedSession && totalTickets > 0 && selectedPaymentMethod
            );
          },

          getSelectedSessionData: (event: unknown) => {
            const { selectedSession } = get();
            const eventData = event as {
              sessions?: Array<{ id: string; name: string; time: string }>;
            };
            return (
              eventData?.sessions?.find(
                session => session.id === selectedSession
              ) ?? null
            );
          },

          getSelectedTicketDetails: (event: unknown) => {
            const { selectedSession, selectedTickets } = get();
            const eventData = event as {
              sessions?: Array<{
                id: string;
                tickets?: Array<{
                  id: string;
                  name: string;
                  price: number;
                }>;
              }>;
            };

            const selectedSessionData = eventData?.sessions?.find(
              session => session.id === selectedSession
            );

            return (
              selectedSessionData?.tickets
                ?.filter(ticket => selectedTickets[ticket.id] > 0)
                .map(ticket => ({
                  name: ticket.name,
                  quantity: selectedTickets[ticket.id],
                  price: ticket.price,
                })) ?? []
            );
          },
        }),
        {
          name: 'checkout-ui-store',
          // 持久化結帳狀態，但不持久化處理狀態
          partialize: state => ({
            selectedSession: state.selectedSession,
            selectedTickets: state.selectedTickets,
            selectedPaymentMethod: state.selectedPaymentMethod,
          }),
        }
      ),
      {
        name: 'checkout-ui-store',
      }
    )
  );
};

export const useCheckoutStore = createCheckoutStore();
