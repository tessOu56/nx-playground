import { type Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/events`);
}
