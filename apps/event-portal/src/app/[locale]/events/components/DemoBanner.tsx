export function DemoBanner() {
  return (
    <div
      className='mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950'
      data-testid='event-stack-demo-banner'
    >
      面試用 demo，不是 production。沒有真實支付、LINE OA 或 Kratos。重置：重跑{' '}
      <code>make seed</code>（本機）或等托管冷啟動／依 HOSTED-DEMO 重置步驟。
    </div>
  );
}
