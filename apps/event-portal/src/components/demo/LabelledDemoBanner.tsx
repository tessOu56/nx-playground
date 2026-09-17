import { demoCopy } from '@/libs/i18n/demo-copy';

export function LabelledDemoBanner({
  locale,
  variant = 'catalog',
}: {
  locale: string;
  variant?: 'catalog' | 'checkout';
}) {
  const copy = demoCopy(locale);
  const title =
    variant === 'checkout' ? copy.checkoutBannerTitle : copy.demoBannerTitle;
  const body =
    variant === 'checkout' ? copy.checkoutBannerBody : copy.demoBannerBody;

  return (
    <div
      className='mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'
      role='note'
      data-testid={
        variant === 'checkout'
          ? 'checkout-mock-payment-banner'
          : 'labelled-demo-banner'
      }
    >
      <strong className='font-semibold'>{title}</strong>
      <span className='mx-1'>—</span>
      {body}
    </div>
  );
}
