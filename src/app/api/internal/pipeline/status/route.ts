import { isPipelineAdminAuthorizedRequest } from '@/lib/adminAccess';
import { getPipelineObservabilityPayload } from '@/lib/pipelineObservability';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isPipelineAdminAuthorizedRequest(request)) {
    return Response.json({ error: 'Unauthorized admin request' }, { status: 401 });
  }

  const payload = await getPipelineObservabilityPayload();
  return Response.json(payload);
}
