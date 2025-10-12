import { Suspense } from 'react';

import { VendorDetailSkeleton } from './components';
import { VendorDetail } from './components/layout/VendorDetail';

import { mockVendors } from '@/libs/mock/vendors';

// 生成靜態參數
export async function generateStaticParams() {
  return mockVendors.map(vendor => ({
    vendorId: vendor.id,
  }));
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;

  return (
    <Suspense fallback={<VendorDetailSkeleton />}>
      <VendorDetail vendorId={vendorId} />
    </Suspense>
  );
}
