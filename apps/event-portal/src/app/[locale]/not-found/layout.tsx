import { type Metadata } from 'next';

import { PageConfigs } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.static;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = demoCopy(locale);
  return {
    title: `${copy.pageNotFound} — NX Playground`,
    description: copy.pageNotFoundHint,
  };
}

export default async function NotFoundLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = demoCopy(locale);

  return (
    <div className='flex min-h-[70vh] items-center justify-center bg-gray-50'>
      <div className='mx-auto w-full max-w-md px-4 text-center'>
        <p className='text-sm font-medium text-gray-500'>404</p>
        <h1 className='mt-2 text-3xl font-semibold tracking-tight text-gray-900'>
          {copy.pageNotFound}
        </h1>
        <p className='mt-3 text-sm leading-6 text-gray-600'>
          {copy.pageNotFoundHint}
        </p>
        <div className='mt-8'>{children}</div>
      </div>
    </div>
  );
}
