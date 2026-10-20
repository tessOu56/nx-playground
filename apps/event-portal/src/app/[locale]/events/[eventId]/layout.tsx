import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { CatalogBackLink } from '@/components/nav/CatalogBackLink';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';

export default async function EventDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale } = await params;
  const copy = demoCopy(locale);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='mb-4'>
          <CatalogBackLink locale={locale} label={copy.backToEvents} />
          <div className='mt-3'>
            <LabelledDemoBanner locale={locale} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
