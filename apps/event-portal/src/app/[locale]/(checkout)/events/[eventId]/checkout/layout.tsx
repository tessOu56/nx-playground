import { BackLink } from '@/components/nav/BackLink';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const copy = demoCopy(locale);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <BackLink
          href={`/${locale}/events/${eventId}`}
          label={copy.backToEvents}
        />
        {children}
      </div>
    </div>
  );
}
