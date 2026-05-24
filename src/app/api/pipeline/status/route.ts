import { getPipelineObservabilityPayload } from '@/lib/pipelineObservability';

export const revalidate = 60;

export async function GET() {
  const payload = await getPipelineObservabilityPayload();
  return Response.json(payload);
}
