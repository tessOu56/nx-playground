import { type NextRequest, NextResponse } from 'next/server';

import { mockBills } from '@/libs/mock/bills';
import { mockOrderItems } from '@/libs/mock/orderItems';
import { mockOrders } from '@/libs/mock/orders';
import { mockPayments } from '@/libs/mock/payments';
import { mockTickets } from '@/libs/mock/tickets';

/**
 * 確認訂單付款並生成票券的 API 端點
 *
 * 功能：
 * 1. 確認該訂單的 bills 已付清
 * 2. 確認 payments 記錄正確
 * 3. 為所有 orderItems 生成對應的票券
 * 4. 更新相關狀態
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // 驗證訂單是否存在
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: '訂單不存在' },
        { status: 404 }
      );
    }

    // 檢查訂單的 bills 狀態
    const orderBills = mockBills.filter(bill => bill.orderId === orderId);
    const unpaidBills = orderBills.filter(bill => bill.status !== 'paid');

    if (unpaidBills.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: '訂單尚有未付清的帳單',
          unpaidBills: unpaidBills.map(bill => ({
            id: bill.id,
            amount: bill.amount,
            status: bill.status,
          })),
        },
        { status: 400 }
      );
    }

    // 檢查 payments 記錄
    const orderPayments =
      mockPayments?.filter(payment => payment.orderId === orderId) ?? [];
    const totalPaidAmount = orderPayments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const totalBillAmount = orderBills.reduce(
      (sum, bill) => sum + bill.amount,
      0
    );

    if (totalPaidAmount < totalBillAmount) {
      return NextResponse.json(
        {
          success: false,
          error: '付款金額不足',
          details: {
            totalRequired: totalBillAmount,
            totalPaid: totalPaidAmount,
            remaining: totalBillAmount - totalPaidAmount,
          },
        },
        { status: 400 }
      );
    }

    // 獲取該訂單的所有 orderItems
    const orderItems = mockOrderItems.filter(item => item.orderId === orderId);

    // 為每個 orderItem 生成票券（如果還沒有的話）
    const newTickets = [];
    const updatedOrderItems = [];

    for (const item of orderItems) {
      if (item.status === 'pending' && !item.ticketId) {
        // 生成新票券
        const ticketId = `${orderId}-ticket-${item.id.split('-').pop()}`;
        const newTicket = {
          id: ticketId,
          orderId,
          eventId: item.eventId,
          type: item.ticketTypeName,
          status: 'issued' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        newTickets.push(newTicket);

        // 更新 orderItem 狀態
        const updatedItem = {
          ...item,
          status: 'issued' as const,
          ticketId,
          updatedAt: new Date().toISOString(),
        };

        updatedOrderItems.push(updatedItem);
      }
    }

    // 更新訂單狀態為已確認
    const updatedOrder = {
      ...order,
      status: 'confirmed' as const,
      updatedAt: new Date().toISOString(),
    };

    // TODO: 在實際應用中，這裡應該更新資料庫
    // 目前只是模擬返回結果

    return NextResponse.json({
      success: true,
      message: '訂單確認成功，票券已生成',
      data: {
        order: updatedOrder,
        generatedTickets: newTickets,
        updatedOrderItems,
        summary: {
          totalBillAmount,
          totalPaidAmount,
          ticketsGenerated: newTickets.length,
          orderItemsUpdated: updatedOrderItems.length,
        },
      },
    });
  } catch (error) {
    console.error('訂單確認處理錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '伺服器內部錯誤',
        details: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 }
    );
  }
}

/**
 * 獲取訂單確認狀態
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: '訂單不存在' },
        { status: 404 }
      );
    }

    const orderBills = mockBills.filter(bill => bill.orderId === orderId);
    const orderPayments =
      mockPayments?.filter(payment => payment.orderId === orderId) ?? [];
    const orderItems = mockOrderItems.filter(item => item.orderId === orderId);
    const orderTickets = mockTickets.filter(
      ticket => ticket.orderId === orderId
    );

    const totalBillAmount = orderBills.reduce(
      (sum, bill) => sum + bill.amount,
      0
    );
    const totalPaidAmount = orderPayments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingItems = orderItems.filter(item => item.status === 'pending');
    const issuedTickets = orderTickets.filter(
      ticket => ticket.status === 'issued'
    );

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        orderStatus: order.status,
        paymentStatus: {
          totalRequired: totalBillAmount,
          totalPaid: totalPaidAmount,
          isPaid: totalPaidAmount >= totalBillAmount,
          unpaidBills: orderBills.filter(bill => bill.status !== 'paid').length,
        },
        ticketStatus: {
          totalItems: orderItems.length,
          pendingItems: pendingItems.length,
          issuedTickets: issuedTickets.length,
          canGenerateTickets:
            pendingItems.length > 0 && totalPaidAmount >= totalBillAmount,
        },
      },
    });
  } catch (error) {
    console.error('獲取訂單狀態錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '伺服器內部錯誤',
        details: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 }
    );
  }
}
