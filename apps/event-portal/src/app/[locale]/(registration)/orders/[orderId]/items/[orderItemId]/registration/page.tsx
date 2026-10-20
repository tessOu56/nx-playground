import { type Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '活動報名表 | NX Playground',
  robots: 'noindex, nofollow',
};

export default async function OrderItemRegistrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/events`);
}
