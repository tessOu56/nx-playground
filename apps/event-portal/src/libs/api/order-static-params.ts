import { listOrders } from '@nx-playground/api-client/event-stack';

const DEMO_USER_ID = 'user_demo';

export async function orderStaticParams(): Promise<{ orderId: string }[]> {
  try {
    const page = await listOrders({ userId: DEMO_USER_ID, limit: 50 });
    if (page.items.length > 0) {
      return page.items.map(order => ({ orderId: order.id }));
    }
  } catch {
    // Hobby build may not reach the API; keep the seed id clickable.
  }
  return [{ orderId: 'order_demo_1' }];
}
