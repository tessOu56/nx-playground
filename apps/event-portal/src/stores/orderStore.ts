import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// SSR 安全檢查
const isClient = () => typeof window !== 'undefined';

// 訂單資料結構類型
interface OrderData {
  order: any;
  bill?: any;
  orderItems?: any;
  tickets?: any;
}

interface OrderUIState {
  // 當前選中的訂單 ID（用於跨頁面狀態管理）
  selectedOrderId: string | null;

  // 當前選中的票券 ID（用於報名表/報到頁面）
  selectedTicketId: string | null;

  // 表單狀態
  isFormSubmitting: boolean;

  // 標準化的訂單資料
  normalizedOrderData: OrderData | null;

  // 設置選中的訂單 ID
  setSelectedOrderId: (orderId: string | null) => void;

  // 設置選中的票券 ID
  setSelectedTicketId: (ticketId: string | null) => void;

  // 設置表單提交狀態
  setFormSubmitting: (isSubmitting: boolean) => void;

  // 標準化訂單資料結構
  normalizeOrderData: (orderData: any) => OrderData;

  // 設置標準化的訂單資料
  setNormalizedOrderData: (orderData: OrderData | null) => void;

  // 清空所有選中狀態
  clearSelection: () => void;
}

// 創建 SSR 安全的 store
const createOrderStore = () => {
  if (!isClient()) {
    // SSR 階段：返回空的 store 實例
    return create<OrderUIState>()(() => ({
      selectedOrderId: null,
      selectedTicketId: null,
      isFormSubmitting: false,
      normalizedOrderData: null,
      setSelectedOrderId: () => {},
      setSelectedTicketId: () => {},
      setFormSubmitting: () => {},
      normalizeOrderData: () => ({ order: null }),
      setNormalizedOrderData: () => {},
      clearSelection: () => {},
    }));
  }

  // 客戶端：使用完整的 store 配置
  return create<OrderUIState>()(
    devtools(
      persist(
        set => ({
          selectedOrderId: null,
          selectedTicketId: null,
          isFormSubmitting: false,
          normalizedOrderData: null,

          setSelectedOrderId: (orderId: string | null) => {
            set({ selectedOrderId: orderId }, false, 'setSelectedOrderId');
          },

          setSelectedTicketId: (ticketId: string | null) => {
            set({ selectedTicketId: ticketId }, false, 'setSelectedTicketId');
          },

          setFormSubmitting: (isSubmitting: boolean) => {
            set({ isFormSubmitting: isSubmitting }, false, 'setFormSubmitting');
          },

          normalizeOrderData: (orderData: any): OrderData => {
            // 處理不同的資料結構
            if (!orderData) {
              return { order: null };
            }

            // 如果 orderData 有 order 屬性，表示是正確的結構
            if ('order' in orderData) {
              const { order, bill, orderItems, tickets } = orderData;
              return { order, bill, orderItems, tickets };
            } else {
              // 如果 orderData 直接是 order 物件，需要重新獲取相關資料
              return {
                order: orderData,
                bill: undefined,
                orderItems: undefined,
                tickets: undefined,
              };
            }
          },

          setNormalizedOrderData: (orderData: OrderData | null) => {
            set(
              { normalizedOrderData: orderData },
              false,
              'setNormalizedOrderData'
            );
          },

          clearSelection: () => {
            set(
              {
                selectedOrderId: null,
                selectedTicketId: null,
                isFormSubmitting: false,
                normalizedOrderData: null,
              },
              false,
              'clearSelection'
            );
          },
        }),
        {
          name: 'order-ui-store',
          // 只持久化選中的 ID，不持久化表單狀態
          partialize: state => ({
            selectedOrderId: state.selectedOrderId,
            selectedTicketId: state.selectedTicketId,
          }),
        }
      ),
      {
        name: 'order-ui-store',
      }
    )
  );
};

export const useOrderStore = createOrderStore();
