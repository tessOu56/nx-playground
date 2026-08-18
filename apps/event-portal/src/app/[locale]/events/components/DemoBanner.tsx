export function DemoBanner() {
  return (
    <div
      className='mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950'
      data-testid='event-stack-demo-banner'
    >
      面試用 demo，不是 production。沒有真實支付、LINE OA 或 Kratos。重置：本機重跑{' '}
      <code>make seed</code>；托管 mock 則 redeploy <code>nx-event-stack-api</code> 或等冷啟動。
    </div>
  );
}
