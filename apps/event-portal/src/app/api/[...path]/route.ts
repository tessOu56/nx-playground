import { handleLabelledDemoRequest } from '@/libs/api/labelled-demo-bff';

export const dynamic = 'force-dynamic';

async function handle(request: Request) {
  return handleLabelledDemoRequest(request);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const OPTIONS = handle;
