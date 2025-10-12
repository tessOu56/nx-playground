import { NextResponse } from 'next/server';

// Configure for static export
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'nx-playground-events',
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    },
    { status: 200 }
  );
}
